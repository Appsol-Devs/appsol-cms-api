import express, { Router } from "express";
import type { BaseLookupController } from "../../../../adapters/controllers/lookups/index.js";
import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import { lookupSchema } from "../../../../validation/lookupShema.js";
import { validate } from "../../middleware/ValidationMiddleware.js";

export class BaseLookupRouter<TController extends BaseLookupController<any>> {
  constructor(
    private readonly controller: TController,
    private readonly authMiddleware: AuthMiddleware,
    private readonly basePath: string,
    private readonly permissionMap: Record<
      "create" | "read" | "readOne" | "update" | "delete",
      string
    >
  ) {}

  register(): Router {
    const router = express.Router();

    router.get(
      this.basePath,
      this.authMiddleware.authenticateToken.bind(this.authMiddleware),
      this.authMiddleware
        .checkPermission(this.permissionMap.read)
        .bind(this.authMiddleware),
      this.controller.getAll.bind(this.controller)
    );

    router.get(
      `${this.basePath}/:id`,
      this.authMiddleware.authenticateToken.bind(this.authMiddleware),
      this.authMiddleware
        .checkPermission(this.permissionMap.readOne)
        .bind(this.authMiddleware),
      this.controller.getOne.bind(this.controller)
    );

    router.post(
      this.basePath,
      this.authMiddleware.authenticateToken.bind(this.authMiddleware),
      this.authMiddleware
        .checkPermission(this.permissionMap.create)
        .bind(this.authMiddleware),
      validate(lookupSchema),
      this.controller.create.bind(this.controller)
    );

    router.put(
      `${this.basePath}/:id`,
      this.authMiddleware.authenticateToken.bind(this.authMiddleware),
      this.authMiddleware
        .checkPermission(this.permissionMap.update)
        .bind(this.authMiddleware),
      this.controller.update.bind(this.controller)
    );

    router.delete(
      `${this.basePath}/:id`,
      this.authMiddleware.authenticateToken.bind(this.authMiddleware),
      this.authMiddleware
        .checkPermission(this.permissionMap.delete)
        .bind(this.authMiddleware),
      this.controller.delete.bind(this.controller)
    );

    return router;
  }
}
