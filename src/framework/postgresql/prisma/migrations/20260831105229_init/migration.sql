/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `CustomerSetup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomerSetup" DROP COLUMN "assignedTo";

-- CreateTable
CREATE TABLE "_CustomerSetupAssignees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CustomerSetupAssignees_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CustomerSetupAssignees_B_index" ON "_CustomerSetupAssignees"("B");

-- AddForeignKey
ALTER TABLE "_CustomerSetupAssignees" ADD CONSTRAINT "_CustomerSetupAssignees_A_fkey" FOREIGN KEY ("A") REFERENCES "CustomerSetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerSetupAssignees" ADD CONSTRAINT "_CustomerSetupAssignees_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
