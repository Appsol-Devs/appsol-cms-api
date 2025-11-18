import { inject } from "inversify";
import type { ICustomer } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { CustomerRepositoryImpl } from "../../../framework/mongodb/repositories/customer/CustomerRepositoryImpl.js";
import type { CloudinaryImpl } from "../../../framework/services/index.js";
import { UnprocessableEntityError } from "../../../error_handler/UnprocessableEntityError.js";

export class CustomerInteractorImpl extends BaseInteractorImpl<ICustomer> {
  constructor(
    @inject(INTERFACE_TYPE.CustomerRepositoryImpl)
    customerRepositoryImpl: CustomerRepositoryImpl,
    @inject(INTERFACE_TYPE.StorageBucketImpl)
    private storageBucketImpl: CloudinaryImpl
  ) {
    super(customerRepositoryImpl);
    this.storageBucketImpl = storageBucketImpl;
  }

  async create(data: ICustomer): Promise<ICustomer> {
    if (!data) throw new UnprocessableEntityError("Data is required");
    //get and upload company logo
    let body = { ...data };

    let image: string = data.image || "";

    if (!image.startsWith("http") && image != "") {
      // Image is in base64 format, so upload it
      const imageUrl = await this.storageBucketImpl.uploadImage(image);
      body = { ...body, image: imageUrl };
    } else {
      body = { ...body, image: image };
    }

    const newCustomer = await super.create(body);
    return newCustomer;
  }

  async update(id: string, data: ICustomer): Promise<ICustomer> {
    if (!data) throw new UnprocessableEntityError("Data is required");
    //get and upload company logo
    let body = { ...data };

    let image: string = data.image || "";

    if (!image.startsWith("http") && image != "") {
      // Image is in base64 format, so upload it
      const imageUrl = await this.storageBucketImpl.uploadImage(image);
      body = { ...body, image: imageUrl };
    } else {
      body = { ...body, image: image };
    }
    return super.update(id, body);
  }
}
