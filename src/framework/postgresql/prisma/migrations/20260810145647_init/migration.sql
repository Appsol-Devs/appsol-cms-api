-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "phone" TEXT,
    "imageUrl" TEXT,
    "roleId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'active',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT,
    "deviceToken" TEXT,
    "createdById" TEXT,
    "loginCount" INTEGER NOT NULL DEFAULT 0,
    "lastLogin" TIMESTAMP(3),
    "lastLoginLocation" JSONB,
    "loginLocations" JSONB,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "companyId" TEXT,
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOTP" (
    "id" TEXT NOT NULL,
    "otp" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Software" (
    "id" TEXT NOT NULL,
    "softwareCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionType" (
    "id" TEXT NOT NULL,
    "subscriptionTypeCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationInMonths" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadStatus" (
    "id" TEXT NOT NULL,
    "leadStatusCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadNextStep" (
    "id" TEXT NOT NULL,
    "leadNextStepCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadNextStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplaintCategory" (
    "id" TEXT NOT NULL,
    "complaintCategoryCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplaintCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallStatus" (
    "id" TEXT NOT NULL,
    "callStatusCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "colorCode" TEXT,
    "isFinalStatus" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachType" (
    "id" TEXT NOT NULL,
    "outreachTypeCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetupStatus" (
    "id" TEXT NOT NULL,
    "setupStatusCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SetupStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "customerCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "dateConverted" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "loggedById" TEXT NOT NULL,
    "softwareId" TEXT NOT NULL,
    "leadId" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "geolocation" JSONB,
    "image" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "storeCode" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "loggedById" TEXT NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "leadCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "leadSource" TEXT NOT NULL,
    "initialEnquiryDate" TIMESTAMP(3),
    "softwareId" TEXT NOT NULL,
    "leadStatus" TEXT NOT NULL,
    "loggedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "leadStageId" TEXT,
    "priority" TEXT NOT NULL,
    "nextStepId" TEXT NOT NULL,
    "isConverted" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "notes" TEXT,
    "geolocation" JSONB,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "paymentCode" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "softwareId" TEXT NOT NULL,
    "approvalNotes" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "totalDue" DOUBLE PRECISION,
    "subscriptionTypeId" TEXT NOT NULL,
    "notes" TEXT,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "renewalDate" TIMESTAMP(3) NOT NULL,
    "loggedById" TEXT,
    "approvedOrRejectedById" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentReference" TEXT,
    "subscriptionId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "subscriptionCode" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "softwareId" TEXT NOT NULL,
    "subscriptionTypeId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "startDate" TIMESTAMP(3) NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "nextBillingDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "cancelledAt" TIMESTAMP(3),
    "cancelledById" TEXT,
    "cancellationReason" TEXT,
    "notes" TEXT,
    "loggedById" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSetup" (
    "id" TEXT NOT NULL,
    "setupCode" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "softwareId" TEXT NOT NULL,
    "setupStatusId" TEXT NOT NULL,
    "addToCalendar" BOOLEAN NOT NULL DEFAULT false,
    "scheduledStart" TIMESTAMP(3) NOT NULL,
    "scheduledEnd" TIMESTAMP(3) NOT NULL,
    "actualCompletionDate" TIMESTAMP(3),
    "notes" TEXT,
    "description" TEXT NOT NULL,
    "assignedTo" JSONB,
    "loggedById" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "priority" TEXT NOT NULL DEFAULT 'low',

    CONSTRAINT "CustomerSetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerComplaint" (
    "id" TEXT NOT NULL,
    "complaintCode" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "complaintTypeId" TEXT NOT NULL,
    "complaintCategoryId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "relatedSoftwareId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "resolvedAt" TIMESTAMP(3),
    "loggedById" TEXT NOT NULL,
    "resolvedById" TEXT,

    CONSTRAINT "CustomerComplaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerOutreach" (
    "id" TEXT NOT NULL,
    "outreachCode" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "softwareId" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "notes" TEXT,
    "callStatusId" TEXT NOT NULL,
    "outreachTypeId" TEXT NOT NULL,
    "outreachTypeIdString" TEXT,
    "callStatusIdString" TEXT,
    "isRoutineCall" BOOLEAN NOT NULL DEFAULT false,
    "loggedById" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "CustomerOutreach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureRequest" (
    "id" TEXT NOT NULL,
    "requestCode" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "softwareId" TEXT NOT NULL,
    "notes" TEXT,
    "requestedDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "assignedTo" JSONB,
    "loggedById" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "priority" TEXT NOT NULL DEFAULT 'low',

    CONSTRAINT "FeatureRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "ticketCode" TEXT NOT NULL,
    "title" TEXT,
    "complaintId" TEXT NOT NULL,
    "customerId" TEXT,
    "assignedEngineerId" TEXT,
    "requestedDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "loggedById" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'low',
    "closedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "history" JSONB,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "notificationCode" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "targetEntityType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "targetEntityId" TEXT NOT NULL,
    "targetEntity" JSONB,
    "loggedById" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionReminder" (
    "id" TEXT NOT NULL,
    "reminderCode" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "softwareId" TEXT NOT NULL,
    "paymentId" TEXT,
    "subscriptionId" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "nextBillingDate" TIMESTAMP(3),
    "lastNotifiedType" TEXT,
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "reminderType" TEXT NOT NULL DEFAULT '30_days',
    "sentVia" TEXT NOT NULL DEFAULT 'email',

    CONSTRAINT "SubscriptionReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "visitorCode" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "idType" TEXT,
    "idNumber" TEXT,
    "visitingWhom" TEXT,
    "purpose" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "passNumber" TEXT,
    "itemsCarriedIn" TEXT,
    "itemsCarriedOut" TEXT,
    "status" TEXT NOT NULL DEFAULT 'checked_in',
    "loggedById" TEXT NOT NULL,
    "photoUrl" TEXT,
    "notes" TEXT,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reschedule" (
    "id" TEXT NOT NULL,
    "rescheduleCode" TEXT NOT NULL,
    "customerId" TEXT,
    "reason" TEXT NOT NULL,
    "title" TEXT,
    "colorCode" TEXT,
    "targetEntityType" TEXT NOT NULL,
    "targetEntityId" TEXT,
    "originalDateTime" TIMESTAMP(3) NOT NULL,
    "newDateTime" TIMESTAMP(3) NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "loggedById" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "Reschedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Software_softwareCode_key" ON "Software"("softwareCode");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionType_subscriptionTypeCode_key" ON "SubscriptionType"("subscriptionTypeCode");

-- CreateIndex
CREATE UNIQUE INDEX "LeadStatus_leadStatusCode_key" ON "LeadStatus"("leadStatusCode");

-- CreateIndex
CREATE UNIQUE INDEX "LeadNextStep_leadNextStepCode_key" ON "LeadNextStep"("leadNextStepCode");

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintCategory_complaintCategoryCode_key" ON "ComplaintCategory"("complaintCategoryCode");

-- CreateIndex
CREATE UNIQUE INDEX "CallStatus_callStatusCode_key" ON "CallStatus"("callStatusCode");

-- CreateIndex
CREATE UNIQUE INDEX "OutreachType_outreachTypeCode_key" ON "OutreachType"("outreachTypeCode");

-- CreateIndex
CREATE UNIQUE INDEX "SetupStatus_setupStatusCode_key" ON "SetupStatus"("setupStatusCode");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerCode_key" ON "Customer"("customerCode");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Store_storeCode_key" ON "Store"("storeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_leadCode_key" ON "Lead"("leadCode");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentCode_key" ON "Payment"("paymentCode");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriptionCode_key" ON "Subscription"("subscriptionCode");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSetup_setupCode_key" ON "CustomerSetup"("setupCode");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerComplaint_complaintCode_key" ON "CustomerComplaint"("complaintCode");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerOutreach_outreachCode_key" ON "CustomerOutreach"("outreachCode");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureRequest_requestCode_key" ON "FeatureRequest"("requestCode");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_ticketCode_key" ON "Ticket"("ticketCode");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_notificationCode_key" ON "Notification"("notificationCode");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionReminder_reminderCode_key" ON "SubscriptionReminder"("reminderCode");

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_visitorCode_key" ON "Visitor"("visitorCode");

-- CreateIndex
CREATE UNIQUE INDEX "Reschedule_rescheduleCode_key" ON "Reschedule"("rescheduleCode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOTP" ADD CONSTRAINT "UserOTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_nextStepId_fkey" FOREIGN KEY ("nextStepId") REFERENCES "LeadNextStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionTypeId_fkey" FOREIGN KEY ("subscriptionTypeId") REFERENCES "SubscriptionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_approvedOrRejectedById_fkey" FOREIGN KEY ("approvedOrRejectedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_subscriptionTypeId_fkey" FOREIGN KEY ("subscriptionTypeId") REFERENCES "SubscriptionType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_cancelledById_fkey" FOREIGN KEY ("cancelledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSetup" ADD CONSTRAINT "CustomerSetup_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSetup" ADD CONSTRAINT "CustomerSetup_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSetup" ADD CONSTRAINT "CustomerSetup_setupStatusId_fkey" FOREIGN KEY ("setupStatusId") REFERENCES "SetupStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSetup" ADD CONSTRAINT "CustomerSetup_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerComplaint" ADD CONSTRAINT "CustomerComplaint_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerComplaint" ADD CONSTRAINT "CustomerComplaint_complaintCategoryId_fkey" FOREIGN KEY ("complaintCategoryId") REFERENCES "ComplaintCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerComplaint" ADD CONSTRAINT "CustomerComplaint_relatedSoftwareId_fkey" FOREIGN KEY ("relatedSoftwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerComplaint" ADD CONSTRAINT "CustomerComplaint_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerComplaint" ADD CONSTRAINT "CustomerComplaint_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOutreach" ADD CONSTRAINT "CustomerOutreach_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOutreach" ADD CONSTRAINT "CustomerOutreach_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOutreach" ADD CONSTRAINT "CustomerOutreach_callStatusId_fkey" FOREIGN KEY ("callStatusId") REFERENCES "CallStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOutreach" ADD CONSTRAINT "CustomerOutreach_outreachTypeId_fkey" FOREIGN KEY ("outreachTypeId") REFERENCES "OutreachType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOutreach" ADD CONSTRAINT "CustomerOutreach_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "CustomerComplaint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedEngineerId_fkey" FOREIGN KEY ("assignedEngineerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionReminder" ADD CONSTRAINT "SubscriptionReminder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionReminder" ADD CONSTRAINT "SubscriptionReminder_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionReminder" ADD CONSTRAINT "SubscriptionReminder_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionReminder" ADD CONSTRAINT "SubscriptionReminder_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reschedule" ADD CONSTRAINT "Reschedule_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reschedule" ADD CONSTRAINT "Reschedule_loggedById_fkey" FOREIGN KEY ("loggedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
