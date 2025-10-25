import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import roleRoutes from "./roleRoutes.js";
import permissionRoutes from "./permissionRoutes.js";
import complaintTypeRoutes from "./lookups/complaintType.js";

const router = express.Router();

router.use(authRoutes);
router.use(userRoutes);
router.use(roleRoutes);
router.use(permissionRoutes);
router.use(complaintTypeRoutes);

export default router;
