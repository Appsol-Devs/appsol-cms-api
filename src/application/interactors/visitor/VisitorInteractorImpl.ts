import { inject } from "inversify";
import type { IVisitor } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { VisitorRepositoryImpl } from "../../../framework/index.js";

export class VisitorInteractorImpl extends BaseInteractorImpl<IVisitor> {
  constructor(
    @inject(INTERFACE_TYPE.VisitorRepositoryImpl)
    visitorRepositoryImpl: VisitorRepositoryImpl
  ) {
    super(visitorRepositoryImpl);
  }
}
