import type { IRole, RequestQuery } from "../../../entities/index.js";

export interface IRoleInteractor {
  getRoles(query: RequestQuery): Promise<IRole[]>;
  addRole(data: IRole): Promise<IRole>;
  updateRole(id: string, data: IRole): Promise<IRole>;
  deleteRole(id: string): Promise<IRole>;
  getARole(id: string): Promise<IRole | null | undefined>;
}
