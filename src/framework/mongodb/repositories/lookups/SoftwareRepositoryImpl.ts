import { injectable } from "inversify";
import type { ISoftware } from "../../../../entities/index.js";
import {
  SoftwareModel,
  SoftwareModelMapper,
} from "../../models/lookups/software.js";
import { BaseLookupRepoistoryImpl } from "../base/BaseLookupRepositoryImpl.js";

@injectable()
export class SoftwareRepositoryImpl extends BaseLookupRepoistoryImpl<ISoftware> {
  constructor() {
    super(SoftwareModel, SoftwareModelMapper);
  }
}
