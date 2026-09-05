import { deprecate } from "node:util";

export type Mapper<TDomain extends object, TModel extends object> = {
  toEntity: (model: TModel | null | undefined) => TDomain | null;

  toEntities: (models: TModel[] | null | undefined) => TDomain[];
};

const nullToUndefined = <T>(value: T | null | undefined): T | undefined => {
  return value ?? undefined;
};

interface MapperOptions {
  /**
   * Maps PostgreSQL/Prisma `id` to the legacy MongoDB `_id`.
   *
   * Example:
   * id: "uuid" → _id: "uuid"
  @deprecate("The `mapIdToLegacyId` option is deprecated and will be removed in future versions.")
   */
  mapIdToLegacyId?: boolean;
}

export const createMapper = <TDomain extends object, TModel extends object>(
  options: MapperOptions = {},
): Mapper<TDomain, TModel> => {
  // const { mapIdToLegacyId = false } = options;

  const toEntity = (model: TModel | null | undefined): TDomain | null => {
    if (model == null) {
      return null;
    }

    const entity: Record<string, unknown> = {};

    Object.entries(model).forEach(([key, value]) => {
      // Backward compatibility:
      // PostgreSQL `id` → legacy MongoDB `_id`
      // if (mapIdToLegacyId && key === "id") {
      //   entity["_id"] = nullToUndefined(value);
      //   return;
      // }

      entity[key] = nullToUndefined(value);
    });

    return entity as TDomain;
  };

  const toEntities = (models: TModel[] | null | undefined): TDomain[] => {
    if (!models) {
      return [];
    }

    return models
      .filter((model): model is TModel => model != null)
      .map(toEntity)
      .filter((entity): entity is TDomain => entity !== null);
  };

  return {
    toEntity,
    toEntities,
  };
};
