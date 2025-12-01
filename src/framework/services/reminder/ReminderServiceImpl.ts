import type mongoose from "mongoose";
import type { IReminderService } from "./IReminderService.js";
import { injectable, inject } from "inversify";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import type { ILogger } from "../../logging/ILogger.js";
import type {
  IBaseRepository,
  PaymentRepositoryImpl,
  SubscriptionReminderRepositoryImpl,
  SubscriptionRepositoryImpl,
} from "../../mongodb/index.js";
import type { IPayment } from "../../../entities/Payment.js";
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
    private notificationService: INotificationService
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.reminderRepository = reminderRepository;
    this.logger = logger;
    this.notificationService = notificationService;
  }

  async triggerReminders(): Promise<{
    success: boolean;
    remindersCreated: number;
    details: any[];
  }> {
    try {
      this.logger.info("Starting reminder trigger process...");

      const remindersCreated: ISubscriptionReminder[] = [];
      const now = new Date();
      const endOfDay = new Date();
      now.setHours(0, 0, 0, 0); // Start of today
      endOfDay.setHours(23, 59, 59, 999); // End of today
      const date30DaysAhead = new Date(endOfDay);
      date30DaysAhead.setDate(date30DaysAhead.getDate() + 30);

      // Get the current date and time
      const dateOverdue = new Date(now);
      dateOverdue.setDate(dateOverdue.getDate() - 1);

      const paginatedResponse = await this.subscriptionRepository.getAll({
        status: "active",
        nextBillingDate: {
          gte: dateOverdue,
          lte: date30DaysAhead,
        },
      });
      const subscriptions = paginatedResponse.data;

      this.logger.info(
        `Found ${subscriptions.length} active subscriptions in reminder window`
      );

      for (const subscription of subscriptions) {
        try {
          const nextBillingDate = new Date(
            subscription.nextBillingDate ?? new Date()
          );
          nextBillingDate.setHours(0, 0, 0, 0);

          // Calculate days until renewal
          const daysUntilRenewal = Math.ceil(
            (nextBillingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          this.logger.info(
            `Subscription ${subscription.subscriptionCode}: ${daysUntilRenewal} days until renewal`
          );

          // Determine which reminder type to create based on days remaining
          let reminderType: TSubscriptionReminderType | null = null;

          reminderType = this.getReminderType(daysUntilRenewal);
          // Skip if no reminder type matched (not at a threshold)
          if (!reminderType) {
            this.logger.info(
              `Subscription ${subscription.subscriptionCode}: No reminder needed (${daysUntilRenewal} days remaining)`
            );
            continue;
          }

          // Check if reminder already exists for this type
          const existingReminder = await this.reminderRepository.findOne({
            subscriptionId: subscription._id,
            reminderType: reminderType,
          });

          if (existingReminder) {
            this.logger.info(
              `Reminder already exists for subscription ${subscription.subscriptionCode} (${reminderType})`
            );
            continue;
          }

          // Create new reminder
          const reminder = await this.reminderRepository.create({
            title: this.generateReminderTitle(
              subscription,
              reminderType,
              daysUntilRenewal
            ),
            customerId: subscription.customerId,
            subscriptionId: subscription._id, // Link to subscription
            paymentId: subscription.lastPaymentId, // Optional: reference to last payment
            dueDate: subscription.nextBillingDate?.toISOString(),
            softwareId: subscription.softwareId,
            reminderType: reminderType,
            isSent: false,
          });

          if (!reminder) {
            this.logger.error(
              `Error creating reminder for subscription ${subscription.subscriptionCode} (${reminderType})`
            );
            continue;
          }

          remindersCreated.push({
            _id: reminder._id,
            subscriptionId: subscription._id,
            customerId: subscription.customerId,
            reminderType: reminderType,
          });

          this.logger.info(
            `✅ Created ${reminderType} reminder for subscription ${subscription.subscriptionCode}`
          );
          await this.notificationService.create({
            userId: subscription.loggedBy,
            message: reminder.title,
            link: `/subscription_reminders/${reminder._id}`,
            targetEntityId: reminder._id,
            targetEntityType: "SubscriptionReminder",
          });
        } catch (error: any) {
          // Handle duplicate key errors gracefully
          if (error.code === 11000) {
            this.logger.info(
              `Duplicate reminder skipped for subscription ${subscription.subscriptionCode}`
            );
          } else {
            this.logger.error(
              `Error processing subscription ${subscription.subscriptionCode}:`,
              error
            );
          }
        }
      }

      this.logger.info(
        `Reminder trigger completed. Created ${remindersCreated.length} reminders`
      );

      return {
        success: true,
        remindersCreated: remindersCreated.length,
        details: remindersCreated,
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
    daysUntilRenewal: number
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
    daysUntilRenewal: number
  ): TSubscriptionReminderType | null {
    let reminderType: TSubscriptionReminderType | null = null;
    switch (daysUntilRenewal) {
      case 0:
        reminderType = "due_today";
        break;
      case 7:
        reminderType = "7_days";
        break;
      case 14:
        reminderType = "14_days";
        break;
      case 30:
        reminderType = "30_days";
        break;
      case -1:
        reminderType = "overdue";
      default:
        break;
    }
    return reminderType;
  }
}
