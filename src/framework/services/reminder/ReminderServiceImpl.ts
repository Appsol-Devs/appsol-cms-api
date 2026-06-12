import type { IReminderService } from "./IReminderService.js";
import { injectable, inject } from "inversify";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import type { ILogger } from "../../logging/ILogger.js";
import type {
  PaymentRepositoryImpl,
  SubscriptionReminderRepositoryImpl,
  SubscriptionRepositoryImpl,
} from "../../mongodb/index.js";
import type {
  ISubscriptionReminder,
  TSubscriptionReminderType,
} from "../../../entities/SubscriptionReminder.js";
import type {
  ICustomer,
  ISoftware,
  ISubscription,
} from "../../../entities/index.js";
import type { INotificationService } from "../index.js";

@injectable()
export class ReminderService implements IReminderService {
  constructor(
    @inject(INTERFACE_TYPE.SubscriptionRepositoryImpl)
    private subscriptionRepository: SubscriptionRepositoryImpl,
    @inject(INTERFACE_TYPE.SubscriptionReminderRepositoryImpl)
    private reminderRepository: SubscriptionReminderRepositoryImpl,
    @inject(INTERFACE_TYPE.Logger)
    private logger: ILogger,
    @inject(INTERFACE_TYPE.NotificationService)
    private notificationService: INotificationService,
    @inject(INTERFACE_TYPE.PaymentRepositoryImpl)
    private paymentRepository: PaymentRepositoryImpl,
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.reminderRepository = reminderRepository;
    this.logger = logger;
    this.notificationService = notificationService;
    this.paymentRepository = paymentRepository;
  }

  async triggerReminders(): Promise<{
    success: boolean;
    remindersProcessed: number;
    details: any[];
  }> {
    try {
      this.logger.info("Starting reminder trigger process...");

      const processedReminders: ISubscriptionReminder[] = [];

      const now = new Date();
      now.setHours(0, 0, 0, 0); // Start of today

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999); // End of today

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1); // For overdue check

      const date30DaysAhead = new Date(endOfDay);
      date30DaysAhead.setDate(date30DaysAhead.getDate() + 30);

      // Fetch all active subscriptions within the reminder window
      const paginatedResponse = await this.subscriptionRepository.getAll({
        status: "active",
        nextBillingDate: {
          gte: yesterday,
          lte: date30DaysAhead,
        },
      });
      const subscriptions = paginatedResponse.data;

      this.logger.info(
        `Found ${subscriptions.length} active subscriptions in reminder window`,
      );

      for (const subscription of subscriptions) {
        try {
          const nextBillingDate = new Date(
            subscription.nextBillingDate ?? new Date(),
          );
          nextBillingDate.setHours(0, 0, 0, 0);

          const daysUntilRenewal = Math.ceil(
            (nextBillingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          );

          this.logger.info(
            `Subscription ${subscription.subscriptionCode}: ${daysUntilRenewal} days until renewal`,
          );

          const reminderType = this.getReminderType(daysUntilRenewal);

          if (!reminderType) {
            this.logger.info(
              `Subscription ${subscription.subscriptionCode}: No reminder threshold matched (${daysUntilRenewal} days remaining)`,
            );
            continue;
          }

          // --- UPSERT: ensure one reminder document per subscription ---
          // Find existing reminder for this subscription (regardless of type)
          let reminder = await this.reminderRepository.findOne({
            subscriptionId: subscription._id,
          });

          if (!reminder) {
            // First time we've seen this subscription — create the record
            reminder = await this.reminderRepository.create({
              title: this.generateReminderTitle(
                subscription,
                reminderType,
                daysUntilRenewal,
              ),
              customerId: subscription.customerId,
              subscriptionId: subscription._id,
              softwareId: subscription.softwareId,
              dueDate: subscription.nextBillingDate?.toISOString(), // Set dueDate to next billing date for easier querying
              nextBillingDate: subscription.nextBillingDate, // <-- store for frontend filtering
              reminderType: reminderType, // <-- tracks current threshold
              lastNotifiedType: null,
              isSent: false,
            });

            if (!reminder) {
              this.logger.error(
                `Failed to create reminder for subscription ${subscription.subscriptionCode}`,
              );
              continue;
            }

            this.logger.info(
              `Created new reminder record for subscription ${subscription.subscriptionCode}`,
            );
          } else {
            // Record exists — update nextBillingDate and current reminderType
            // in case the subscription was renewed and has a new billing date

            reminder = await this.reminderRepository.update(reminder._id!, {
              title: this.generateReminderTitle(
                subscription,
                reminderType,
                daysUntilRenewal,
              ),
              dueDate: subscription.nextBillingDate?.toISOString(),
              nextBillingDate: subscription.nextBillingDate,
              reminderType: reminderType,
            });
          }

          // --- NOTIFICATION DEDUP: only notify if this threshold hasn't been sent yet ---
          if (reminder.lastNotifiedType === reminderType) {
            this.logger.info(
              `Notification already sent for subscription ${subscription.subscriptionCode} at threshold (${reminderType}) — skipping`,
            );
            continue;
          }

          // Generate a payment record when the subscription is due today
          if (reminderType === "due_today") {
            await this.paymentRepository.create({
              subscriptionTypeId: subscription.subscriptionTypeId,
              customerId: subscription.customerId,
              softwareId: subscription.softwareId,
              totalDue: subscription.amount,
              amount: 0,
              status: "generated",
              renewalDate: subscription.currentPeriodEnd?.toISOString(),
              paymentDate: new Date().toISOString(),
            });
          }

          // Send notification and mark this threshold as notified
          await this.notificationService.create({
            userId: subscription.loggedBy,
            message: reminder.title,
            link: `/subscription_reminders/${reminder._id}`,
            targetEntityId: reminder._id,
            targetEntityType: "SubscriptionReminder",
          });

          await this.reminderRepository.update(reminder._id!, {
            lastNotifiedType: reminderType,
            isSent: true,
          });

          this.logger.info(
            `✅ Notified (${reminderType}) for subscription ${subscription.subscriptionCode}`,
          );

          processedReminders.push({
            _id: reminder._id,
            subscriptionId: subscription._id,
            customerId: subscription.customerId,
            reminderType: reminderType,
          });
        } catch (error: any) {
          if (error.code === 11000) {
            this.logger.info(
              `Duplicate key skipped for subscription ${subscription.subscriptionCode}`,
            );
          } else {
            this.logger.error(
              `Error processing subscription ${subscription.subscriptionCode}:`,
              error,
            );
          }
        }
      }

      this.logger.info(
        `Reminder trigger completed. Processed ${processedReminders.length} reminders`,
      );

      return {
        success: true,
        remindersProcessed: processedReminders.length,
        details: processedReminders,
      };
    } catch (error) {
      this.logger.error("Error in triggerReminders:", error);
      throw error;
    }
  }

  /**
   * Generates a  reminder title based on payment and reminder type
   */
  private generateReminderTitle(
    subscription: ISubscription,
    reminderType: TSubscriptionReminderType,
    daysUntilRenewal: number,
  ): string {
    const softwareName =
      (subscription.software as ISoftware)?.name || "Software";
    const companyName =
      (subscription.customer as ICustomer)?.companyName || "Client";

    switch (reminderType) {
      case "30_days":
        return `${companyName}'s ${softwareName} subscription renews in 30 days`;

      case "14_days":
        return `${companyName}'s ${softwareName} subscription renews in 14 days`;

      case "7_days":
        return `Urgent: ${companyName}'s ${softwareName} subscription renews in 7 days`;

      case "due_today":
        return `Action Required: ${companyName}'s ${softwareName} subscription renews today`;

      case "overdue":
        const daysOverdue = Math.abs(daysUntilRenewal);
        return `Overdue: ${companyName}'s ${softwareName} subscription expired ${daysOverdue} ${
          daysOverdue === 1 ? "day" : "days"
        } ago`;

      default:
        return `${companyName}'s ${softwareName} subscription renewal reminder`;
    }
  }

  private getReminderType(
    daysUntilRenewal: number,
  ): TSubscriptionReminderType | null {
    if (daysUntilRenewal < 0) return "overdue";
    if (daysUntilRenewal === 0) return "due_today";
    if (daysUntilRenewal <= 7) return "7_days";
    if (daysUntilRenewal <= 14) return "14_days";
    if (daysUntilRenewal <= 30) return "30_days";
    return null;
  }
}
