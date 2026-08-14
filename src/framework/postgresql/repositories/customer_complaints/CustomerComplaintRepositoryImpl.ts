import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { ICustomerComplaint } from "../../../../entities/index.js";

const CustomerComplaintDelegate = prisma.customerComplaint;

const customerComplaintMapper = {
  toEntity(record: any): ICustomerComplaint {
    return record as ICustomerComplaint;
  },
  toDtoCreation(payload: Partial<ICustomerComplaint>) {
    return payload;
  },
};

@injectable()
export class CustomerComplaintRepositoryImpl extends PrismaBaseRepositoryImpl<ICustomerComplaint> {
  constructor() {
    super(CustomerComplaintDelegate, customerComplaintMapper);
  }
}
