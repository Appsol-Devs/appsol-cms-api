// jobs/reminderCron.ts
import cron from "node-cron";
import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";
import type { ILogger } from "../logging/ILogger.js";
import type { IReminderService } from "../services/reminder/IReminderService.js";
import { container } from "../webserver/index.js";

export const startReminderCron = () => {
  const logger = container.get<ILogger>(INTERFACE_TYPE.Logger);
  const reminderService = container.get<IReminderService>(
    INTERFACE_TYPE.ReminderServiceImpl
  );

  // Run every day at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    logger.info("Starting scheduled reminder job...");
    try {
      const result = await reminderService.triggerReminders();
      logger.info(
        `Reminder job completed: ${result.remindersCreated} reminders created`
      );
    } catch (error) {
      logger.error("Error in scheduled reminder job:", error);
    }
  });

  logger.info("Reminder CRON job scheduled: Daily at 8:00 AM");
};
