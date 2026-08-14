import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type {
  IVisitor,
  IVisitorRequestQuery,
} from "../../../../entities/index.js";

const VisitorDelegate = prisma.visitor;

const visitorMapper = {
  toEntity(record: any): IVisitor {
    return {
      _id: record.id,
      visitorCode: record.visitorCode,
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      company: record.company,
      idType: record.idType,
      idNumber: record.idNumber,
      visitingWhom: record.visitingWhom,
      purpose: record.purpose,
      checkInTime: record.checkInTime && new Date(record.checkInTime),
      checkOutTime: record.checkOutTime && new Date(record.checkOutTime),
      passNumber: record.passNumber,
      itemsCarriedIn: record.itemsCarriedIn,
      itemsCarriedOut: record.itemsCarriedOut,
      status: record.status,
      loggedBy: record.loggedById,
      photoUrl: record.photoUrl,
      notes: record.notes,
    } as IVisitor;
  },
  toDtoCreation(payload: Partial<IVisitor>) {
    return {
      visitorCode: (payload as any).visitorCode,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      company: payload.company,
      idType: payload.idType,
      idNumber: payload.idNumber,
      visitingWhom: payload.visitingWhom,
      purpose: payload.purpose,
      checkInTime: payload.checkInTime,
      checkOutTime: payload.checkOutTime,
      passNumber: payload.passNumber,
      itemsCarriedIn: payload.itemsCarriedIn,
      itemsCarriedOut: payload.itemsCarriedOut,
      status: payload.status,
      loggedById: payload.loggedBy as string,
      photoUrl: payload.photoUrl,
      notes: payload.notes,
    };
  },
};

@injectable()
export class VisitorRepositoryImpl extends PrismaBaseRepositoryImpl<IVisitor> {
  constructor() {
    super(VisitorDelegate, visitorMapper);
  }

  async getAll(query: IVisitorRequestQuery) {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { visitorCode: { contains: search, mode: "insensitive" } },
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    if (query.loggedBy) where.loggedById = query.loggedBy;
    if (query.startDate && query.endDate)
      where.createdAt = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };

    const [items, total] = await Promise.all([
      this.delegate.findMany({
        where,
        skip,
        take: limit,
        include: { loggedBy: true },
      }),
      this.delegate.count({ where }),
    ]);

    return {
      data: items.map(this.mapper.toEntity),
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      pageCount: pageIndex,
    };
  }
}
