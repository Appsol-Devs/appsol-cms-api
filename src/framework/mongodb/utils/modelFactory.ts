import mongoose, {
  type Document,
  type SchemaDefinition,
  type Model,
  Schema,
} from "mongoose";
import { withBaseSchema } from "./baseModel.js";
import type { BaseLookupDocument } from "./lookupFactory.js";

export const createModel = <
  TDomain extends object, // domain entity type (e.g. ISoftware)
  TDocument extends Document = BaseLookupDocument // mongoose document type
>(
  modelName: string,
  definition: SchemaDefinition | Schema,
  prefix: string,
  idFieldName: string
): {
  Model: Model<TDocument>;
  Mapper: {
    toDtoCreation: (payload: TDomain) => any;
    toEntity: (doc: any) => TDomain;
  };
} => {
  //check whether definition is a schema or a schema definition

  let schema: Schema<TDocument>;
  if (definition instanceof Schema) {
    schema = definition;
  } else {
    schema = new Schema<TDocument>(definition, { timestamps: true });
  }
  withBaseSchema(schema!, {
    prefix: prefix,
    idFieldName: idFieldName,
  });

  const Model = mongoose.model<TDocument>(modelName, schema);
  const def = definition instanceof Schema ? definition.obj : definition;
  const Mapper = {
    toDtoCreation: (payload: any) => {
      const dto: Record<string, any> = {};
      Object.keys(def).forEach((key) => {
        dto[key] = payload[key];
      });
      return dto;
    },
    toEntity: (doc: any) => {
      const entity: Record<string, any> = {};
      Object.keys(def).forEach((key) => {
        entity[key] = doc[key];
      });
      entity._id = doc._id?.toString();
      return entity as TDomain;
    },
  };

  return { Model, Mapper };
};
