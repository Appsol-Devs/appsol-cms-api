import mongoose, { Schema, Document, Model } from "mongoose";
import { withBaseSchema } from "./baseModel.js";

export interface BaseLookupDocument extends Document {
  name: string;
  description?: string;
  isActive?: boolean;
}

interface LookupModelOptions {
  prefix: string;
  idFieldName: string;
}

/**
 * Creates a LookupModel with the specified options.
 *
 * @param {string} modelName - name of the mongoose model
 * @param {LookupModelOptions} options - options for creating the LookupModel
 * @returns {{Model: Model<TDocument>, Mapper: {toDtoCreation: (payload: TDomain) => any, toEntity: (doc: any) => TDomain}}}
 */
export const createLookupModel = <
  TDomain extends object, // domain entity type (e.g. ISoftware)
  TDocument extends BaseLookupDocument = BaseLookupDocument // mongoose document type
>(
  modelName: string,
  options: LookupModelOptions
): {
  Model: Model<TDocument>;
  Mapper: {
    toDtoCreation: (payload: TDomain) => any;
    toEntity: (doc: any) => TDomain;
  };
} => {
  const schema = new Schema<TDocument>(
    {
      [options.idFieldName]: { type: String, unique: true },
      name: { type: String, required: true },
      description: { type: String },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  );

  withBaseSchema(schema, {
    prefix: options.prefix,
    idFieldName: options.idFieldName,
  });

  const Model = mongoose.model<TDocument>(modelName, schema);

  const Mapper = {
    toDtoCreation: (payload: any) => ({
      [options.idFieldName]: payload[options.idFieldName],
      name: payload.name,
      description: payload.description,
      isActive: payload.isActive,
    }),
    toEntity: (doc: any) =>
      ({
        _id: doc._id.toString(),
        [options.idFieldName]: doc[options.idFieldName],
        name: doc.name,
        description: doc.description,
        isActive: doc.isActive,
      } as TDomain),
  };

  return { Model, Mapper };
};
