import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import roleRoutes from "./roleRoutes.js";
import permissionRoutes from "./permissionRoutes.js";
import complaintTypeRoutes from "./lookups/complaintType.js";
import softwareRoutes from "./lookups/software.js";
import complaintCategoryRoutes from "./lookups/complaintCategory.js";
import callStatusRoutes from "./lookups/callStatus.js";
import setupStatusRoutes from "./lookups/setupStatus.js";
import subscriptionRoutes from "./lookups/subscriptionType.js";

const router = express.Router();

router.use(authRoutes);
router.use(userRoutes);
router.use(roleRoutes);
router.use(permissionRoutes);
router.use(complaintTypeRoutes);
router.use(softwareRoutes);
router.use(complaintCategoryRoutes);
router.use(callStatusRoutes);
router.use(setupStatusRoutes);
router.use(subscriptionRoutes);

export default router;
