import { injectable } from "inversify";
import type { ICallStatus } from "../../../../entities/index.js";
import {
  CallStatusModel,
  CallStatusModelMapper,
} from "../../models/lookups/callStatus.js";
import { BaseLookupRepoistoryImpl } from "../base/BaseLookupRepositoryImpl.js";

@injectable()
export class CallStatusRepositoryImpl extends BaseLookupRepoistoryImpl<ICallStatus> {
  constructor() {
    super(CallStatusModel, CallStatusModelMapper);
  }
}
