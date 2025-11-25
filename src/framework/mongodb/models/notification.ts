import { Schema, type SchemaDefinition } from "mongoose";
import { createModel } from "../utils/modelFactory.js";

import type { INotification } from "../../../entities/Notification.js";

const notificationSchema: SchemaDefinition = {
  notificationCode: { type: String, unique: true },
  message: { type: String, required: true },
  targetEntityType: {
    type: String,
    required: true,
    enum: ["CustomerOutreach", "CustomerComplaint"],
  },
  userId: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  link: { type: String, required: false },
  isRead: { type: Boolean, required: true, default: false },
  readAt: { type: Date, required: false },
  targetEntityId: { type: String, required: true },
  targetEntity: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "targetEntityType",
  },
  loggedBy: { type: Schema.Types.ObjectId, required: false, ref: "User" },
};

export const { Model: NotificationModel, Mapper: NotificationModelMapper } =
  createModel<INotification>(
    "Notification",
    notificationSchema,
    "NTC",
    "notificationCode"
  );
