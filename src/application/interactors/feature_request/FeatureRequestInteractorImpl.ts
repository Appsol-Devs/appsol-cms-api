import { inject } from "inversify";
import type { IFeatureRequest } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { IBaseRepository } from "../../../domain/repositories/base/IBaseRepository.js";
export class FeatureRequestInteractorImpl extends BaseInteractorImpl<IFeatureRequest> {
  constructor(
    @inject(INTERFACE_TYPE.FeatureRequestRepositoryImpl)
    featureRequestRepository: IBaseRepository<IFeatureRequest>,
  ) {
    super(featureRequestRepository as any);
  }
}
