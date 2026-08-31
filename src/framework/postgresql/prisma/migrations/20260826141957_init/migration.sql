-- DropForeignKey
ALTER TABLE "CustomerOutreach" DROP CONSTRAINT "CustomerOutreach_softwareId_fkey";

-- AlterTable
ALTER TABLE "CustomerOutreach" ALTER COLUMN "softwareId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "initialEnquiryDate" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "CustomerOutreach" ADD CONSTRAINT "CustomerOutreach_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE SET NULL ON UPDATE CASCADE;
