import { injectable } from "inversify";
import type { IOutreachType } from "../../../../entities/index.js";

import { BaseLookupRepoistoryImpl } from "../base/BaseLookupRepositoryImpl.js";
import {
  OutreachTypeModel,
  OutreachTypeModelMapper,
} from "../../models/lookups/outreachType.js";

@injectable()
export class OutreachTypeRepositoryImpl extends BaseLookupRepoistoryImpl<IOutreachType> {
  constructor() {
    super(OutreachTypeModel, OutreachTypeModelMapper);
  }
}
