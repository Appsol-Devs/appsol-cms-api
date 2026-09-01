/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `FeatureRequest` table. All the data in the column will be lost.
  - You are about to drop the column `leadStageId` on the `Lead` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeatureRequest" DROP COLUMN "assignedTo";

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "leadStageId";

-- CreateTable
CREATE TABLE "_FeatureRequestAssignees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FeatureRequestAssignees_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FeatureRequestAssignees_B_index" ON "_FeatureRequestAssignees"("B");

-- AddForeignKey
ALTER TABLE "_FeatureRequestAssignees" ADD CONSTRAINT "_FeatureRequestAssignees_A_fkey" FOREIGN KEY ("A") REFERENCES "FeatureRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureRequestAssignees" ADD CONSTRAINT "_FeatureRequestAssignees_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
