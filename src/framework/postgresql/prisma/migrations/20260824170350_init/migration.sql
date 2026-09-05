-- AddForeignKey
ALTER TABLE "CustomerComplaint" ADD CONSTRAINT "CustomerComplaint_complaintTypeId_fkey" FOREIGN KEY ("complaintTypeId") REFERENCES "ComplaintType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
