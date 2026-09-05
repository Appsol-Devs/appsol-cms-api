/*
  Warnings:

  - You are about to drop the column `outreachTypeCode` on the `ComplaintType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[complaintTypeCode]` on the table `ComplaintType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `complaintTypeCode` to the `ComplaintType` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ComplaintType_outreachTypeCode_key";

-- AlterTable
ALTER TABLE "ComplaintType" DROP COLUMN "outreachTypeCode",
ADD COLUMN     "complaintTypeCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintType_complaintTypeCode_key" ON "ComplaintType"("complaintTypeCode");
