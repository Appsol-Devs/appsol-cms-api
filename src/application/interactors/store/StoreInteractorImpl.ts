import { inject } from "inversify";
import type { IStore } from "../../../entities/Store.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { StoreRepositoryImpl } from "../../../framework/index.js";

export class StoreInteractorImpl extends BaseInteractorImpl<IStore> {
  constructor(
    @inject(INTERFACE_TYPE.StoreRepositoryImpl)
    storeRepositoryImpl: StoreRepositoryImpl,
  ) {
    super(storeRepositoryImpl);
  }
}
