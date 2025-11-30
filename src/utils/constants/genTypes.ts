import type { Response } from "express";
export type TGenericPromise = Promise<
  Response<any, Record<string, any>> | undefined
>;
export type TPriority = "P1" | "P2" | "P3" | "P4";

export interface IDateRange {
  gte?: Date | string | undefined | null;
  lte?: Date | string | undefined | null;
}
