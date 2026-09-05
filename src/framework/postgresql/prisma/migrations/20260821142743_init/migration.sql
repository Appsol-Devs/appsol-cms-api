-- AlterTable
ALTER TABLE "CallStatus" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "ComplaintCategory" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "ComplaintType" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "CustomerComplaint" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "CustomerOutreach" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "CustomerSetup" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "FeatureRequest" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "LeadNextStep" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "LeadStatus" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "OutreachType" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Reschedule" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "SetupStatus" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Software" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "SubscriptionReminder" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "SubscriptionType" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "UserOTP" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "Visitor" ADD COLUMN     "createdById" TEXT;
