import type mongoose from "mongoose";
import type { IReminderService } from "./IReminderService.js";
import { injectable, inject } from "inversify";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import type { ILogger } from "../../logging/ILogger.js";
import type {
  IBaseRepository,
  PaymentRepositoryImpl,
  SubscriptionReminderRepositoryImpl,
} from "../../mongodb/index.js";
import type { IPayment } from "../../../entities/Payment.js";
import type {
  ISubscriptionReminder,
  TSubscriptionReminderType,
} from "../../../entities/SubscriptionReminder.js";
import type { ICustomer, ISoftware } from "../../../entities/index.js";

@injectable()
export class ReminderService implements IReminderService {
  constructor(
    @inject(INTERFACE_TYPE.PaymentRepositoryImpl)
    private paymentRepository: PaymentRepositoryImpl,
    @inject(INTERFACE_TYPE.SubscriptionReminderRepositoryImpl)
    private reminderRepository: SubscriptionReminderRepositoryImpl,
    @inject(INTERFACE_TYPE.Logger)
    private logger: ILogger
  ) {}

  async triggerReminders(): Promise<{
    success: boolean;
    remindersCreated: number;
    details: any[];
  }> {
    try {
      this.logger.info("Starting reminder trigger process...");

      const remindersCreated: ISubscriptionReminder[] = [];
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Start of today

      // Get all approved payments that haven't been fully processed
      const paginatedResponse = await this.paymentRepository.getAll({
        status: "approved",
      });
      const payments = paginatedResponse.data;

      this.logger.info(`Found ${payments.length} approved payments to check`);

      for (const payment of payments) {
        try {
          const renewalDate = new Date(payment.renewalDate ?? new Date());
          renewalDate.setHours(0, 0, 0, 0);

          // Calculate days until renewal
          const daysUntilRenewal = Math.ceil(
            (renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          this.logger.info(
            `Payment ${payment._id}: ${daysUntilRenewal} days until renewal`
          );

          // Determine which reminder type to create based on days remaining
          let reminderType: TSubscriptionReminderType | null = null;

          reminderType = this.getReminderType(daysUntilRenewal);
          // Skip if no reminder type matched (not at a threshold)
          if (!reminderType) {
            this.logger.info(
              `Payment ${payment._id}: No reminder needed (${daysUntilRenewal} days remaining)`
            );
            continue;
          }

          // Check if reminder already exists for this type
          const existingReminder = await this.reminderRepository.findOne({
            paymentId: payment._id,
            reminderType: reminderType,
          });

          if (existingReminder) {
            this.logger.info(
              `Reminder already exists for payment ${payment._id} (${reminderType})`
            );
            continue;
          }

          // Create new reminder
          const reminder = await this.reminderRepository.create({
            title: this.generateReminderTitle(
              payment,
              reminderType,
              daysUntilRenewal
            ),
            customerId: payment.customerId,
            paymentId: payment._id,
            dueDate: payment.renewalDate,
            softwareId: payment.softwareId,
            reminderType: reminderType,
            isSent: false,
          });

          if (!reminder) {
            this.logger.error(
              `Error creating reminder for payment ${payment._id}`
            );
            continue;
          }

          remindersCreated.push({
            _id: reminder._id,
            title: reminder.title,
            paymentId: payment._id,
            customerId: payment.customerId,
            reminderType: reminderType,
            dueDate: payment.renewalDate,
          });

          this.logger.info(
            `Created ${reminderType} reminder for payment ${payment._id} (${daysUntilRenewal} days remaining)`
          );
        } catch (error: any) {
          // Handle duplicate key errors gracefully
          if (error.code === 11000) {
            this.logger.info(
              `Duplicate reminder skipped for payment ${payment._id}`
            );
          } else {
            this.logger.error(
              `Error processing payment ${payment._id}:`,
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
    payment: IPayment,
    reminderType: TSubscriptionReminderType,
    daysUntilRenewal: number
  ): string {
    const softwareName = (payment.software as ISoftware)?.name || "Software";
    const companyName =
      (payment.customer as ICustomer)?.companyName || "Client";

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
      default:
        break;
    }
    return reminderType;
  }
}
