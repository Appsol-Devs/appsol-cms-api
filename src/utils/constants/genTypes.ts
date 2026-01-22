import type { Response } from "express";
export type TGenericPromise = Promise<
  Response<any, Record<string, any>> | undefined
>;
export type TPriority = "low" | "medium" | "high" | "critical";

export interface IDateRange {
  gte?: Date | string | undefined | null;
  lte?: Date | string | undefined | null;
}
