export interface IReminderService {
  triggerReminders(): Promise<{
    success: boolean;
    remindersProcessed: number;
    details: any[];
  }>;
}
