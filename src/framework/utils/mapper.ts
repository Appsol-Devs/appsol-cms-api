export type Mapper<TDomain extends object, TModel extends object> = {
  toEntity: (model: TModel | null | undefined) => TDomain | null;

  toEntities: (models: TModel[] | null | undefined) => TDomain[];
};

const nullToUndefined = <T>(value: T | null | undefined): T | undefined => {
  return value ?? undefined;
};

export const createMapper = <
  TDomain extends object,
  TModel extends object,
>(): Mapper<TDomain, TModel> => {
  const toEntity = (model: TModel | null | undefined): TDomain | null => {
    if (model == null) {
      return null;
    }

    const entity: Record<string, unknown> = {};

    Object.entries(model).forEach(([key, value]) => {
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
