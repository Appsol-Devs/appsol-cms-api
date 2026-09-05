-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "lastPaymentId" TEXT;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_lastPaymentId_fkey" FOREIGN KEY ("lastPaymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
