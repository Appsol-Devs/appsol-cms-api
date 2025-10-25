import type { Response } from "express";
export type TGenericPromise = Promise<
  Response<any, Record<string, any>> | undefined
>;
