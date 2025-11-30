import { inject } from "inversify";
import type {
  IPayment,
  ISubscription,
  ISubscriptionType,
} from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type {
  IBaseRepository,
  PaymentRepositoryImpl,
} from "../../../framework/mongodb/repositories/index.js";
import type { IBaseInteractor } from "../base/IBaseInteractor.js";
import { BadRequestError } from "../../../error_handler/BadRequestError.js";

export class PaymentInteractorImpl extends BaseInteractorImpl<IPayment> {
  constructor(
    @inject(INTERFACE_TYPE.PaymentRepositoryImpl)
    paymentRepositoryImpl: PaymentRepositoryImpl,
    @inject(INTERFACE_TYPE.SubscriptionRepositoryImpl)
    private subscriptionRepository: IBaseRepository<ISubscription>
  ) {
    super(paymentRepositoryImpl);
    this.subscriptionRepository = subscriptionRepository;
  }

  async update(id: string, data: IPayment): Promise<IPayment> {
    if (!data.status) throw new BadRequestError("Data is required");
    if (data.status === "approved") {
      const transaction = await Promise.all([
        super.update(id, data),
        this.extendSubscription(data),
      ]);

      return transaction[0];
    }

    return super.update(id, data);
  }

  private async extendSubscription(
    payment: IPayment
  ): Promise<ISubscription | null | undefined> {
    try {
      let subscription: ISubscription | null | undefined;
      const now = new Date();
      const duration =
        (payment?.subscriptionType as ISubscriptionType)?.durationInMonths ??
        12; // e.g., 1
      // Check if this is the first payment (subscription creation)
      const existingSubscription = await this.subscriptionRepository.findOne({
        customerId: payment.customerId,
        softwareId: payment.softwareId,
      });

      if (!existingSubscription) {
        // Expiry is Today + 1 Month
        const startDate = new Date();
        const currentPeriodStart = new Date(startDate);
        const currentPeriodEnd = new Date(startDate);
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + duration);

        const nextBillingDate = new Date(currentPeriodEnd);

        // First payment - create new subscription
        subscription = await this.subscriptionRepository.create({
          customerId: payment.customerId,
          softwareId: payment.softwareId,
          subscriptionTypeId: payment.subscriptionTypeId,
          // amount: payment.amount,
          nextBillingDate,
          currentPeriodStart,
          currentPeriodEnd,
          startDate: now,
          loggedBy: payment.approvedOrRejectedBy as string,
          status: "active",
        });
      } else {
        // Renewal payment - extend subscription
        // Calculate new period
        const newPeriodStart = new Date(
          existingSubscription.currentPeriodEnd ?? now
        );
        const newPeriodEnd = new Date(newPeriodStart);
        newPeriodEnd.setMonth(newPeriodEnd.getMonth() + duration);

        const newNextBillingDate = new Date(newPeriodEnd);
        const data: Partial<ISubscription> = {
          currentPeriodStart: newPeriodStart,
          currentPeriodEnd: newPeriodEnd,
          nextBillingDate: newNextBillingDate,
          lastPaymentId: payment._id,
          lastPaymentDate: new Date(),
          status: "active",
        };
        subscription = await this.subscriptionRepository.update(
          existingSubscription._id!,
          data
        );
      }

      return subscription;
    } catch (error) {
      throw new Error("Error activating subscription");
    }
  }
}
