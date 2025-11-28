import { inject, injectable } from "inversify";

import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseController } from "../base/BaseController.js";
import type { Request, Response, NextFunction } from "express";
import type { TGenericPromise } from "../../../utils/constants/genTypes.js";
import { HttpStatusCode } from "../../../utils/constants/enums.js";
import type { IControllerUserRequest } from "../auth_controller/IController.js";
import { BadRequestError } from "../../../error_handler/BadRequestError.js";
import type { PaymentInteractorImpl } from "../../../application/interactors/payment/PaymentInteractorImpl.js";
import type {
  IPayment,
  IPaymentRequestQuery,
} from "../../../entities/Payment.js";
import type { TargetEntityType } from "../../../entities/Reschedule.js";

@injectable()
export class PaymentController extends BaseController<IPayment> {
  constructor(
    @inject(INTERFACE_TYPE.PaymentInteractorImpl)
    interactor: PaymentInteractorImpl
  ) {
    super(interactor);
  }

  async approveOrRejectPayment(
    req: IControllerUserRequest,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      if (!req.params) throw new BadRequestError("Request params are required");

      const paymentStatus = req.params.status as IPayment["status"];
      const paymentId = req.params.id;

      if (!paymentId) throw new BadRequestError("Payment id is required");
      if (!paymentStatus)
        throw new BadRequestError("Payment status is required");

      if (paymentStatus !== "approved" && paymentStatus !== "rejected") {
        throw new BadRequestError("Invalid payment status");
      }

      const data: Partial<IPayment> = {
        status: paymentStatus,
        approvalNotes: req.body.approvalNotes,
        approvedOrRejectedBy: req.user?._id,
      };

      const response = await this.interactor.update(paymentId, data);
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const query: IPaymentRequestQuery = {
        search: req.query.search?.toString(),
        pageIndex: req.query.pageIndex ? Number(req.query.pageIndex) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        status: req.query.status?.toString() as unknown as IPayment["status"],
        customerId: req.query.customerId?.toString() ?? undefined,
        loggedBy: req.query.loggedBy?.toString() ?? undefined,
        subscriptionTypeId:
          req.query.subscriptionTypeId?.toString() ?? undefined,
        paymentDate: req.query.paymentDate?.toString() ?? undefined,
        renewalDate: {
          gte: req.query.renewalStartDate?.toString() ?? undefined,
          lte: req.query.renewalEndDate?.toString() ?? undefined,
        },
      };

      const response = await this.interactor.getAll(query);

      res.set({
        "x-pagination": JSON.stringify({
          totalPages: response.totalPages,
          pageCount: response.pageCount,
          totalCount: response.totalCount,
        }),
        "x-total-pending": response.totalPending?.toString() || "0",
        "x-total-approved": response.totalApproved?.toString() || "0",
        "x-total-amount": response.totalSum?.toString() || "0",
      });

      return res.status(HttpStatusCode.OK).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: IControllerUserRequest,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      if (!req.body) throw new BadRequestError("Request body is required");
      const createdBy = req.user?._id;
      const response = await this.interactor.create({
        ...req.body,
        createdBy,
        loggedBy: createdBy,
      });

      return res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
}
