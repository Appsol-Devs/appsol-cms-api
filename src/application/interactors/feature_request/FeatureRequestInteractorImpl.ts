import { inject } from "inversify";
import type { IFeatureRequest } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { FeatureRequestRepositoryImpl } from "../../../framework/mongodb/repositories/feature_request/index.js";
export class FeatureRequestInteractorImpl extends BaseInteractorImpl<IFeatureRequest> {
  constructor(
    @inject(INTERFACE_TYPE.FeatureRequestRepositoryImpl)
    featureRequestRepositoryImpl: FeatureRequestRepositoryImpl
  ) {
    super(featureRequestRepositoryImpl);
  }
}
