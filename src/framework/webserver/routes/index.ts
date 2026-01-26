import express from "express";
import type { Container } from "inversify";
import type { Router } from "express";

import { createAuthRoutes } from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import roleRoutes from "./roleRoutes.js";
import permissionRoutes from "./permissionRoutes.js";
import complaintTypeRoutes from "./lookups/complaintType.js";
import softwareRoutes from "./lookups/software.js";
import complaintCategoryRoutes from "./lookups/complaintCategory.js";
import callStatusRoutes from "./lookups/callStatus.js";
import setupStatusRoutes from "./lookups/setupStatus.js";
import subscriptionRoutes from "./lookups/subscriptionType.js";
import leadStatusroutes from "./lookups/leadStatus.js";
import leadNextStepRoutes from "./lookups/leadNextStep.js";
import leadRoutes from "./leadRoutes.js";
import customerRoutes from "./customerRoutes.js";
import customerComplaintRoutes from "./customerComplaintsRoutes.js";
import customerOutreachRoutes from "./customerOutreachRoutes.js";
import outreachTypeRoutes from "./lookups/outreachType.js";
import rescheduleRoutes from "./rescheduleRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import featureRequestRoutes from "./featureRequestRoutes.js";
import subscriptionReminderRoutes, {
  createSubscriptionReminderRoutes,
} from "./subscriptionReminderRoutes.js";
import customerSetupRoutes from "./customerSetupRoutes.js";
import createNotificationRoutes from "./notificationRoutes.js";
import createSubscriptionRoutes from "./subscriptionRoutes.js";
import createVisitorRoutes from "./visitorRoutes.js";
import createTicketRoutes from "./ticketRoutes.js";
import createDashboardRoutes from "./dashboardRoutes.js";

export const createRoutes = (container: Container): Router => {
  const router = express.Router();

  router.use(createAuthRoutes(container));
  router.use(userRoutes(container));
  router.use(roleRoutes(container));
  router.use(permissionRoutes(container));
  router.use(complaintTypeRoutes(container));
  router.use(softwareRoutes(container));
  router.use(complaintCategoryRoutes(container));
  router.use(callStatusRoutes(container));
  router.use(setupStatusRoutes(container));
  router.use(subscriptionRoutes(container));
  router.use(leadStatusroutes(container));
  router.use(leadNextStepRoutes(container));
  router.use(leadRoutes(container));
  router.use(customerRoutes(container));
  router.use(customerComplaintRoutes(container));
  router.use(customerOutreachRoutes(container));
  router.use(outreachTypeRoutes(container));
  router.use(rescheduleRoutes(container));
  router.use(paymentRoutes(container));
  router.use(featureRequestRoutes(container));
  router.use(subscriptionReminderRoutes(container));
  router.use(customerSetupRoutes(container));
  router.use(createNotificationRoutes(container));
  router.use(createSubscriptionReminderRoutes(container));
  router.use(createSubscriptionRoutes(container));
  router.use(createVisitorRoutes(container));
  router.use(createTicketRoutes(container));
  router.use(createDashboardRoutes(container));

  return router;
};

export default createRoutes;
