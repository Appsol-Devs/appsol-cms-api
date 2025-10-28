import mongoose, {
  Schema,
  Document,
  Model,
  type SchemaDefinition,
} from "mongoose";
import { withBaseSchema } from "./baseModel.js";

export interface BaseLookupDocument extends Document {
  name: string;
  description?: string;
  isActive?: boolean;
}

interface LookupModelOptions {
  prefix: string;
  idFieldName: string;
  extraFields?: SchemaDefinition;
}

/**
 * Creates a LookupModel with the specified options.
 *
 * @param {string} modelName - name of the mongoose model
 * @param {LookupModelOptions} options - options for creating the LookupModel
 *
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
  const schemaDefinition: SchemaDefinition = {
    [options.idFieldName]: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    ...(options.extraFields ?? {}),
  };

  const schema = new Schema<TDocument>(schemaDefinition, { timestamps: true });

  withBaseSchema(schema, {
    prefix: options.prefix,
    idFieldName: options.idFieldName,
  });

  const Model = mongoose.model<TDocument>(modelName, schema);

  const Mapper = {
    toDtoCreation: (payload: any) => {
      const dto: Record<string, any> = {};
      Object.keys(schemaDefinition).forEach((key) => {
        dto[key] = payload[key];
      });
      return dto;
    },
    toEntity: (doc: any) => {
      const entity: Record<string, any> = {};
      Object.keys(schemaDefinition).forEach((key) => {
        entity[key] = doc[key];
      });
      entity._id = doc._id?.toString();
      return entity as TDomain;
    },
  };

  return { Model, Mapper };
};
