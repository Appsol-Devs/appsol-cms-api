import mongoose, { Schema, Document } from "mongoose";
import { withBaseSchema } from "../../utils/baseModel.js";
import type { IComplaintType } from "../../../../entities/lookups/ComplaintType.js";

export interface ComplaintTypeDocument extends Document {
  complaintTypeCode: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

const compliantTypeSchema = new Schema<ComplaintTypeDocument>({
  complaintTypeCode: { type: String, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

withBaseSchema(compliantTypeSchema, {
  prefix: "CT",
  idFieldName: "complaintTypeCode",
});

export const ComplaintTypeModel = mongoose.model<ComplaintTypeDocument>(
  "ComplaintType",
  compliantTypeSchema
);

export const ComplaintTypeModelMapper = {
  toDtoCreation: (payload: IComplaintType) => ({
    complaintTypeCode: payload.complaintTypeCode,
    name: payload.name,
    description: payload.description,
    isActive: payload.isActive,
  }),
  toEntity: (doc: any): IComplaintType => ({
    _id: doc._id.toString(),
    complaintTypeCode: doc.complaintTypeCode,
    name: doc.name,
    description: doc.description,
    isActive: doc.isActive,
  }),
};
