import { PrismaBaseRepositoryImpl } from "../base/PrismaBaseRepositoryImpl.js";
import { prisma } from "../../utils/prisma.js";
import { injectable } from "inversify";
import type { ISoftware } from "../../../../entities/lookups/Software.js";
import { generateModelCode } from "../../../../utils/helpers.js";

const SoftwareDelegate = prisma.software;

const softwareMapper = {
  toEntity(record: any): ISoftware {
    return record as ISoftware;
  },
  toDtoCreation(payload: Partial<ISoftware>) {
    return payload;
  },
};

@injectable()
export class SoftwareRepositoryImpl extends PrismaBaseRepositoryImpl<ISoftware> {
  constructor() {
    super(SoftwareDelegate, softwareMapper);
  }

  create(data: ISoftware): Promise<ISoftware | null | undefined> {
    const softwareCode = generateModelCode("SW");
    data.softwareCode = softwareCode;
    return super.create(data);
  }
}
