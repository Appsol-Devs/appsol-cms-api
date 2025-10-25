import type { RequestQuery, IRole } from "../../../../entities/User.js";

export interface IRoleRepository {
  getAllRoles(query: RequestQuery): Promise<IRole[]>;
  getARole(id: string): Promise<IRole | null | undefined>;
  addRole(data: IRole): Promise<IRole | null | undefined>;
  updateRole(id: string, data: IRole): Promise<IRole | null | undefined>;
  deleteRole(id: string): Promise<IRole | null | undefined>;
  findByName(name: string): Promise<IRole | null | undefined>;
}
