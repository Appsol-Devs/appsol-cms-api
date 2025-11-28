export interface IReminderService {
  triggerReminders(): Promise<{
    success: boolean;
    remindersCreated: number;
    details: any[];
  }>;
}
