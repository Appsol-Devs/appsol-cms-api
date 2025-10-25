import { inject, injectable } from "inversify";
import type {
  IComplaintType,
  PaginatedResponse,
  RequestQuery,
} from "../../../../entities/index.js";
import type { IComplaintTypeInteractor } from "./IComplaintTypeInteractor.js";
import type { IComplaintTypeRepository } from "../../../../framework/mongodb/repositories/complaint_type/IComplaintTypeRepository.js";
import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { NotFoundError } from "../../../../error_handler/NotFoundError.js";
import { UnprocessableEntityError } from "../../../../error_handler/UnprocessableEntityError.js";
import { BadRequestError } from "../../../../error_handler/index.js";

@injectable()
export class ComplaintTypeInteractorImpl implements IComplaintTypeInteractor {
  constructor(
    @inject(INTERFACE_TYPE.ComplaintTypeRepository)
    private readonly complaintTypeRepository: IComplaintTypeRepository
  ) {
    this.complaintTypeRepository = complaintTypeRepository;
  }
  async updateComplaintType(
    id: string,
    data: IComplaintType
  ): Promise<IComplaintType> {
    if (!id)
      throw new UnprocessableEntityError("Complaint Type id is required");
    if (!data)
      throw new UnprocessableEntityError("Complaint Type data is required");

    let body = { ...data };
    const type = await this.complaintTypeRepository.getAComplaintType(id);
    if (!type) throw new NotFoundError("Complaint Type not found");
    body = { ...body };

    const updatedType = await this.complaintTypeRepository.updateComplaintType(
      id,
      body
    );

    if (!updatedType) throw new Error("Error while updating complaint type");
    return updatedType;
  }
  getAllComplaintTypes(
    query: RequestQuery
  ): Promise<PaginatedResponse<IComplaintType>> {
    return this.complaintTypeRepository.getAllComplaintTypes(query);
  }
  async deleteComplaintType(id: string): Promise<IComplaintType> {
    if (!id) throw new UnprocessableEntityError("User id is required");
    const deletedComplaintType =
      await this.complaintTypeRepository.deleteComplaintType(id);
    if (!deletedComplaintType) throw new BadRequestError("Error deleting user");
    return deletedComplaintType;
  }
  async addComplaintType(data: IComplaintType): Promise<IComplaintType> {
    if (!data)
      throw new UnprocessableEntityError("Complaint Type data is required");
    const newComplaintType =
      await this.complaintTypeRepository.addComplaintType(data);
    if (!newComplaintType)
      throw new BadRequestError("Error while adding complaint type");
    return newComplaintType;
  }
  async getAComplaintType(id: string): Promise<IComplaintType> {
    if (!id)
      throw new UnprocessableEntityError("Complaint Type id is required");
    const type = await this.complaintTypeRepository.getAComplaintType(id);
    if (!type) throw new NotFoundError("Complaint Type not found");
    return type;
  }
}
