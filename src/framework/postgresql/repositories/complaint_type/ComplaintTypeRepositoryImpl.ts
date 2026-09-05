import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type {
  IComplaintType,
  PaginatedResponse,
  RequestQuery,
} from "../../../../entities/index.js";
import type { IComplaintTypeRepository } from "../../../mongodb/index.js";
import { UnprocessableEntityError } from "../../../../error_handler/UnprocessableEntityError.js";
import { createMapper } from "../../../utils/mapper.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { generateModelCode } from "../../../../utils/helpers.js";

const ComplaintTypeDelegate = prisma.complaintType;

@injectable()
export class ComplaintTypeRepositoryImpl implements IComplaintTypeRepository {
  async getAllComplaintTypes(
    query: RequestQuery,
  ): Promise<PaginatedResponse<IComplaintType>> {
    const searchQuery = query.search || "";
    const limit = query.pageSize || 10;
    const pageIndex = query.pageIndex || 1;
    const skip = (pageIndex - 1) * limit;

    const where: any = {
      isDeleted: false,
    };

    if (searchQuery) {
      where.OR = [
        {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ];
    }

    const [complaintTypes, totalCount] = await Promise.all([
      ComplaintTypeDelegate.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      ComplaintTypeDelegate.count({
        where,
      }),
    ]);

    const ComplaintTypeMapper = createMapper<
      IComplaintType,
      (typeof complaintTypes)[0]
    >({
      mapIdToLegacyId: true,
    });

    return {
      data: complaintTypes.map(
        ComplaintTypeMapper.toEntity,
      ) as IComplaintType[],
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      pageCount: pageIndex,
    };
  }

  async getAComplaintType(
    id: string,
  ): Promise<IComplaintType | null | undefined> {
    const complaintType = await ComplaintTypeDelegate.findUnique({
      where: { id },
    });

    if (!complaintType) {
      return null;
    }

    const ComplaintTypeMapper = createMapper<
      IComplaintType,
      typeof complaintType
    >({
      mapIdToLegacyId: true,
    });

    return ComplaintTypeMapper.toEntity(complaintType);
  }

  async addComplaintType(
    data: IComplaintType,
  ): Promise<IComplaintType | null | undefined> {
    if (!data) {
      throw new UnprocessableEntityError("Complaint Type data is required");
    }
    const ctCode = generateModelCode("CT");
    const ctData: IComplaintType = {
      name: data.name,
      description: data.description,
      colorCode: data.colorCode,
      isActive: data.isActive ?? true,
      complaintTypeCode: ctCode,
    };

    const created = await ComplaintTypeDelegate.create({
      data: ctData as any,
    });

    const ComplaintTypeMapper = createMapper<IComplaintType, typeof created>({
      mapIdToLegacyId: true,
    });

    return ComplaintTypeMapper.toEntity(created);
  }

  async updateComplaintType(
    id: string,
    data: IComplaintType,
  ): Promise<IComplaintType | null | undefined> {
    const existing = await ComplaintTypeDelegate.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Complaint Type not found");
    }

    const { id: _id, ...rest } = data;

    const updated = await ComplaintTypeDelegate.update({
      where: { id },
      data: rest as any,
    });

    const ComplaintTypeMapper = createMapper<IComplaintType, typeof updated>({
      mapIdToLegacyId: true,
    });

    return ComplaintTypeMapper.toEntity(updated);
  }

  async deleteComplaintType(
    id: string,
  ): Promise<IComplaintType | null | undefined> {
    if (!id) {
      throw new UnprocessableEntityError("Complaint Type id is required");
    }

    const complaintType = await ComplaintTypeDelegate.findUnique({
      where: { id },
    });

    if (!complaintType) {
      throw new NotFoundError("Complaint Type not found");
    }

    await ComplaintTypeDelegate.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    const ComplaintTypeMapper = createMapper<
      IComplaintType,
      typeof complaintType
    >({
      mapIdToLegacyId: true,
    });

    return ComplaintTypeMapper.toEntity(complaintType);
  }
}
