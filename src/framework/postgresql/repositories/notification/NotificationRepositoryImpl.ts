import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import {
  INotification,
  type INotificationRequestQuery,
} from "../../../../entities/Notification.js";
import { generateModelCode } from "../../../../utils/helpers.js";
import { createMapper } from "../../../utils/mapper.js";

const NotificationDelegate = prisma.notification;

const notificationMapper = {
  toEntity(record: any): INotification {
    const NotificationMapper = createMapper<INotification, typeof record>({});
    return NotificationMapper.toEntity(record)!;
  },
  toDtoCreation(payload: Partial<INotification>) {
    return payload as any;
  },
};

@injectable()
export class NotificationRepositoryImpl extends PrismaBaseRepositoryImpl<INotification> {
  constructor() {
    super(NotificationDelegate, notificationMapper);
  }

  async getAll(query: INotificationRequestQuery) {
    const search = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { notificationCode: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    if (query.targetEntityType) where.targetEntityType = query.targetEntityType;
    if (query.targetEntityId) where.targetEntityId = query.targetEntityId;
    if (query.status) where.status = query.status;
    if (query.isRead !== undefined) where.isRead = query.isRead;
    else where.isRead = false;

    if (query.startDate && query.endDate) {
      where.createdAt = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };
    }

    const [items, total] = await Promise.all([
      this.delegate.findMany({
        where,
        skip,
        take: limit,
        include: { user: true, loggedBy: true },
        orderBy: { createdAt: "desc" },
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

  async getById(id: string) {
    const record = await this.delegate.findUnique({
      where: { id },
      include: { user: true, loggedBy: true },
    });
    if (!record) throw new Error("Notification not found");
    return this.mapper.toEntity(record);
  }

  async create(data: Partial<INotification>) {
    const notificationCode = generateModelCode("NT");
    data.notificationCode = notificationCode;
    const created = await this.delegate.create({
      data: data as any,
      include: { user: true, loggedBy: true },
    });
    return this.mapper.toEntity(created);
  }

  async update(id: string, data: Partial<INotification>) {
    const updated = await this.delegate.update({
      where: { id },
      data: data as any,
      include: { user: true, loggedBy: true },
    });
    return this.mapper.toEntity(updated);
  }
}
