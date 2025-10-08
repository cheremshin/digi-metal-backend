import { pgTable, pgSchema, unique, check, serial, varchar, boolean, timestamp, foreignKey, uuid, text, integer, date, inet, numeric, bigint, jsonb, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const userManagement = pgSchema("user_management");
export const fileStorage = pgSchema("file_storage");
export const productionFlow = pgSchema("production_flow");
export const sales = pgSchema("sales");
export const equipmentStatusInProductionFlow = productionFlow.enum("equipment_status", ['operational', 'need in service', 'out of service'])
export const unitInProductionFlow = productionFlow.enum("unit", ['g', 'kg', 'm', 'mm', 'l', 'ml'])
export const statusInSales = sales.enum("status", ['pending', 'in progress', 'completed', 'cancelled'])
export const clientRequestStatusInUserManagement = userManagement.enum("client_request_status", ['new', 'in_review', 'approved', 'rejected', 'account_created'])
export const userStatusInUserManagement = userManagement.enum("user_status", ['active', 'inactive', 'suspended', 'pending_activation'])


export const roleInUserManagement = userManagement.table("role", {
	roleId: serial("role_id").primaryKey().notNull(),
	roleName: varchar("role_name", { length: 50 }).notNull(),
	description: varchar({ length: 255 }),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	unique("role_role_name_key").on(table.roleName),
	check("role_name_check", sql`(role_name)::text <> ''::text`),
	check("created_at_check", sql`created_at <= CURRENT_TIMESTAMP`),
	check("role_role_id_not_null", sql`NOT NULL role_id`),
	check("role_role_name_not_null", sql`NOT NULL role_name`),
]);

export const permissionInUserManagement = userManagement.table("permission", {
	permissionId: serial("permission_id").primaryKey().notNull(),
	permissionName: varchar("permission_name", { length: 100 }).notNull(),
	description: varchar({ length: 255 }),
	resource: varchar({ length: 50 }).notNull(),
	action: varchar({ length: 50 }).notNull(),
}, (table) => [
	unique("permission_permission_name_key").on(table.permissionName),
	check("permission_name_check", sql`(permission_name)::text <> ''::text`),
	check("resource_check", sql`(resource)::text <> ''::text`),
	check("action_check", sql`(action)::text <> ''::text`),
	check("permission_permission_id_not_null", sql`NOT NULL permission_id`),
	check("permission_permission_name_not_null", sql`NOT NULL permission_name`),
	check("permission_resource_not_null", sql`NOT NULL resource`),
	check("permission_action_not_null", sql`NOT NULL action`),
]);

export const clientRequestInUserManagement = userManagement.table("client_request", {
	requestId: uuid("request_id").defaultRandom().primaryKey().notNull(),
	companyName: varchar("company_name", { length: 255 }).notNull(),
	contactPerson: varchar("contact_person", { length: 100 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	phone: varchar({ length: 20 }),
	businessType: varchar("business_type", { length: 100 }),
	description: text(),
	status: clientRequestStatusInUserManagement().default('new').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	reviewedAt: timestamp("reviewed_at", { mode: 'string' }),
	reviewedBy: integer("reviewed_by"),
	rejectionReason: text("rejection_reason"),
	createdUserId: integer("created_user_id"),
	notes: text(),
}, (table) => [
	foreignKey({
			columns: [table.reviewedBy],
			foreignColumns: [userInUserManagement.userId],
			name: "client_request_reviewed_by_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.createdUserId],
			foreignColumns: [userInUserManagement.userId],
			name: "client_request_created_user_id_fkey"
		}).onDelete("set null"),
	check("company_name_check", sql`(company_name)::text <> ''::text`),
	check("contact_person_check", sql`(contact_person)::text <> ''::text`),
	check("email_check", sql`((email)::text <> ''::text) AND ((email)::text ~~ '%@%'::text)`),
	check("created_at_check", sql`created_at <= CURRENT_TIMESTAMP`),
	check("client_request_request_id_not_null", sql`NOT NULL request_id`),
	check("client_request_company_name_not_null", sql`NOT NULL company_name`),
	check("client_request_contact_person_not_null", sql`NOT NULL contact_person`),
	check("client_request_email_not_null", sql`NOT NULL email`),
	check("client_request_status_not_null", sql`NOT NULL status`),
]);

export const userInUserManagement = userManagement.table("user", {
	userId: serial("user_id").primaryKey().notNull(),
	username: varchar({ length: 50 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	passwordSalt: varchar("password_salt", { length: 255 }).notNull(),
	firstName: varchar("first_name", { length: 50 }).notNull(),
	lastName: varchar("last_name", { length: 50 }).notNull(),
	middleName: varchar("middle_name", { length: 50 }),
	phone: varchar({ length: 20 }),
	position: varchar({ length: 100 }),
	department: varchar({ length: 100 }),
	hireDate: date("hire_date"),
	status: userStatusInUserManagement().default('pending_activation').notNull(),
	lastLogin: timestamp("last_login", { mode: 'string' }),
	failedLoginAttempts: integer("failed_login_attempts").default(0),
	passwordResetToken: varchar("password_reset_token", { length: 255 }),
	passwordResetExpires: timestamp("password_reset_expires", { mode: 'string' }),
	twoFactorEnabled: boolean("two_factor_enabled").default(false),
	twoFactorSecret: varchar("two_factor_secret", { length: 255 }),
	twoFactorBackupCodes: text("two_factor_backup_codes").array(),
	tempVerificationCode: varchar("temp_verification_code", { length: 6 }),
	tempCodeExpires: timestamp("temp_code_expires", { mode: 'string' }),
	tempCodeType: varchar("temp_code_type", { length: 50 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedAt: timestamp("last_modified_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedBy: integer("last_modified_by"),
	isArchived: boolean("is_archived").default(false),
}, (table) => [
	unique("user_username_key").on(table.username),
	unique("user_email_key").on(table.email),
	check("username_check", sql`(username)::text <> ''::text`),
	check("email_check", sql`((email)::text <> ''::text) AND ((email)::text ~~ '%@%'::text)`),
	check("password_hash_check", sql`(password_hash)::text <> ''::text`),
	check("password_salt_check", sql`(password_salt)::text <> ''::text`),
	check("first_name_check", sql`(first_name)::text <> ''::text`),
	check("last_name_check", sql`(last_name)::text <> ''::text`),
	check("failed_login_attempts_check", sql`failed_login_attempts >= 0`),
	check("created_at_check", sql`created_at <= CURRENT_TIMESTAMP`),
	check("last_modified_at_check", sql`last_modified_at <= CURRENT_TIMESTAMP`),
	check("user_user_id_not_null", sql`NOT NULL user_id`),
	check("user_username_not_null", sql`NOT NULL username`),
	check("user_email_not_null", sql`NOT NULL email`),
	check("user_password_hash_not_null", sql`NOT NULL password_hash`),
	check("user_password_salt_not_null", sql`NOT NULL password_salt`),
	check("user_first_name_not_null", sql`NOT NULL first_name`),
	check("user_last_name_not_null", sql`NOT NULL last_name`),
	check("user_status_not_null", sql`NOT NULL status`),
]);

export const userSessionInUserManagement = userManagement.table("user_session", {
	sessionId: uuid("session_id").defaultRandom().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	ipAddress: inet("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	isActive: boolean("is_active").default(true),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [userInUserManagement.userId],
			name: "user_session_user_id_fkey"
		}).onDelete("cascade"),
	check("created_at_check", sql`created_at <= CURRENT_TIMESTAMP`),
	check("expires_at_check", sql`expires_at > created_at`),
	check("user_session_session_id_not_null", sql`NOT NULL session_id`),
	check("user_session_user_id_not_null", sql`NOT NULL user_id`),
	check("user_session_expires_at_not_null", sql`NOT NULL expires_at`),
]);

export const clientInfoInUserManagement = userManagement.table("client_info", {
	clientId: serial("client_id").primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	companyName: varchar("company_name", { length: 255 }).notNull(),
	businessType: varchar("business_type", { length: 100 }),
	taxNumber: varchar("tax_number", { length: 50 }),
	registrationNumber: varchar("registration_number", { length: 50 }),
	legalAddress: text("legal_address"),
	billingAddress: text("billing_address"),
	contactPerson: varchar("contact_person", { length: 100 }),
	contactPhone: varchar("contact_phone", { length: 20 }),
	contactEmail: varchar("contact_email", { length: 100 }),
	paymentTerms: integer("payment_terms").default(30),
	creditLimit: numeric("credit_limit", { precision: 12, scale:  2 }).default('0.00'),
	discountPercentage: numeric("discount_percentage", { precision: 5, scale:  2 }).default('0.00'),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedAt: timestamp("last_modified_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedBy: integer("last_modified_by"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [userInUserManagement.userId],
			name: "client_info_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.lastModifiedBy],
			foreignColumns: [userInUserManagement.userId],
			name: "client_info_last_modified_by_fkey"
		}).onDelete("set null"),
	unique("client_info_user_id_key").on(table.userId),
	check("company_name_check", sql`(company_name)::text <> ''::text`),
	check("payment_terms_check", sql`payment_terms > 0`),
	check("credit_limit_check", sql`credit_limit >= (0)::numeric`),
	check("discount_percentage_check", sql`(discount_percentage >= (0)::numeric) AND (discount_percentage <= (100)::numeric)`),
	check("created_at_check", sql`created_at <= CURRENT_TIMESTAMP`),
	check("last_modified_at_check", sql`last_modified_at <= CURRENT_TIMESTAMP`),
	check("client_info_client_id_not_null", sql`NOT NULL client_id`),
	check("client_info_user_id_not_null", sql`NOT NULL user_id`),
	check("client_info_company_name_not_null", sql`NOT NULL company_name`),
]);

export const fileInFileStorage = fileStorage.table("file", {
	fileId: uuid("file_id").defaultRandom().primaryKey().notNull(),
	fileName: varchar("file_name", { length: 255 }).notNull(),
	filePath: varchar("file_path", { length: 512 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fileSize: bigint("file_size", { mode: "number" }).notNull(),
	mimeType: varchar("mime_type", { length: 100 }).notNull(),
	bucketName: varchar("bucket_name", { length: 50 }).notNull(),
	hash: varchar({ length: 255 }).notNull(),
	uploadedBy: integer("uploaded_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	isArchived: boolean("is_archived").default(false),
	tempSessionId: uuid("temp_session_id").defaultRandom(),
	tempEmail: varchar("temp_email", { length: 100 }),
}, (table) => [
	foreignKey({
			columns: [table.uploadedBy],
			foreignColumns: [userInUserManagement.userId],
			name: "file_uploaded_by_fkey"
		}).onDelete("set null"),
	check("file_name_check", sql`(file_name)::text <> ''::text`),
	check("mime_type_check", sql`(mime_type)::text <> ''::text`),
	check("bucket_name_check", sql`(bucket_name)::text <> ''::text`),
	check("hash_check", sql`(hash)::text <> ''::text`),
	check("created_at_check", sql`created_at <= CURRENT_TIMESTAMP`),
	check("file_file_id_not_null", sql`NOT NULL file_id`),
	check("file_file_name_not_null", sql`NOT NULL file_name`),
	check("file_file_path_not_null", sql`NOT NULL file_path`),
	check("file_file_size_not_null", sql`NOT NULL file_size`),
	check("file_mime_type_not_null", sql`NOT NULL mime_type`),
	check("file_bucket_name_not_null", sql`NOT NULL bucket_name`),
	check("file_hash_not_null", sql`NOT NULL hash`),
]);

export const materialCategoryInProductionFlow = productionFlow.table("material_category", {
	categoryId: serial("category_id").primaryKey().notNull(),
	title: varchar({ length: 100 }).notNull(),
	description: varchar({ length: 512 }).notNull(),
}, (table) => [
	check("title_check", sql`(title)::text <> ''::text`),
	check("description_check", sql`(description)::text <> ''::text`),
	check("material_category_category_id_not_null", sql`NOT NULL category_id`),
	check("material_category_title_not_null", sql`NOT NULL title`),
	check("material_category_description_not_null", sql`NOT NULL description`),
]);

export const materialInProductionFlow = productionFlow.table("material", {
	materialId: serial("material_id").primaryKey().notNull(),
	title: varchar({ length: 100 }).notNull(),
	categoryId: integer("category_id"),
	quantity: numeric({ precision: 10, scale:  2 }).default('0.00').notNull(),
	unit: unitInProductionFlow().notNull(),
	costPerUnit: numeric("cost_per_unit", { precision: 10, scale:  10 }).default('0.00').notNull(),
	minimumStock: numeric("minimum_stock", { precision: 10, scale:  2 }).default('0.00').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedAt: timestamp("last_modified_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedBy: integer("last_modified_by"),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [materialCategoryInProductionFlow.categoryId],
			name: "material_category_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.lastModifiedBy],
			foreignColumns: [userInUserManagement.userId],
			name: "material_last_modified_by_fkey"
		}).onDelete("set null"),
	check("title_check", sql`(title)::text <> ''::text`),
	check("quantity_check", sql`quantity >= (0)::numeric`),
	check("cost_per_unit_check", sql`cost_per_unit >= (0)::numeric`),
	check("minimum_stock_check", sql`minimum_stock >= (0)::numeric`),
	check("created_at_check", sql`created_at <= CURRENT_TIMESTAMP`),
	check("last_modified_at_check", sql`last_modified_at <= CURRENT_TIMESTAMP`),
	check("material_material_id_not_null", sql`NOT NULL material_id`),
	check("material_title_not_null", sql`NOT NULL title`),
	check("material_quantity_not_null", sql`NOT NULL quantity`),
	check("material_unit_not_null", sql`NOT NULL unit`),
	check("material_cost_per_unit_not_null", sql`NOT NULL cost_per_unit`),
	check("material_minimum_stock_not_null", sql`NOT NULL minimum_stock`),
]);

export const equipmentSpecsInProductionFlow = productionFlow.table("equipment_specs", {
	specsId: serial("specs_id").primaryKey().notNull(),
	technicalSpecs: jsonb("technical_specs"),
	cost: numeric({ precision: 10, scale:  2 }).default('0.00').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedAt: timestamp("last_modified_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedBy: integer("last_modified_by"),
	isArchived: boolean("is_archived").default(false),
}, (table) => [
	foreignKey({
			columns: [table.lastModifiedBy],
			foreignColumns: [userInUserManagement.userId],
			name: "equipment_specs_last_modified_by_fkey"
		}).onDelete("set null"),
	check("cost_check", sql`cost >= (0)::numeric`),
	check("created_at_check", sql`created_at <= CURRENT_TIMESTAMP`),
	check("last_modified_at_check", sql`last_modified_at <= CURRENT_TIMESTAMP`),
	check("equipment_specs_specs_id_not_null", sql`NOT NULL specs_id`),
	check("equipment_specs_cost_not_null", sql`NOT NULL cost`),
]);

export const equipmentInProductionFlow = productionFlow.table("equipment", {
	equipmentId: serial("equipment_id").primaryKey().notNull(),
	title: varchar({ length: 100 }).notNull(),
	specsId: integer("specs_id"),
	lastServiceDate: date("last_service_date"),
	nextServiceDate: date("next_service_date"),
	status: equipmentStatusInProductionFlow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedAt: timestamp("last_modified_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedBy: integer("last_modified_by"),
	isArchived: boolean("is_archived").default(false),
}, (table) => [
	foreignKey({
			columns: [table.specsId],
			foreignColumns: [equipmentSpecsInProductionFlow.specsId],
			name: "equipment_specs_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.lastModifiedBy],
			foreignColumns: [userInUserManagement.userId],
			name: "equipment_last_modified_by_fkey"
		}).onDelete("set null"),
	check("title_check", sql`(title)::text <> ''::text`),
	check("next_service_date_check", sql`(next_service_date IS NULL) OR (next_service_date >= CURRENT_DATE)`),
	check("created_at_check", sql`created_at <= CURRENT_TIMESTAMP`),
	check("last_modified_at_check", sql`last_modified_at <= CURRENT_TIMESTAMP`),
	check("equipment_equipment_id_not_null", sql`NOT NULL equipment_id`),
	check("equipment_title_not_null", sql`NOT NULL title`),
	check("equipment_status_not_null", sql`NOT NULL status`),
]);

export const taskTypeInProductionFlow = productionFlow.table("task_type", {
	taskTypeId: serial("task_type_id").primaryKey().notNull(),
	title: varchar({ length: 100 }).notNull(),
	description: text(),
}, (table) => [
	unique("task_type_title_key").on(table.title),
	check("title_check", sql`(title)::text <> ''::text`),
	check("task_type_task_type_id_not_null", sql`NOT NULL task_type_id`),
	check("task_type_title_not_null", sql`NOT NULL title`),
]);

export const technologicalMapInProductionFlow = productionFlow.table("technological_map", {
	mapId: serial("map_id").primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedAt: timestamp("last_modified_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedBy: integer("last_modified_by"),
	isArchived: boolean("is_archived").default(false),
}, (table) => [
	foreignKey({
			columns: [table.lastModifiedBy],
			foreignColumns: [userInUserManagement.userId],
			name: "technological_map_last_modified_by_fkey"
		}).onDelete("set null"),
	check("title_check", sql`(title)::text <> ''::text`),
	check("created_at_check", sql`created_at <= CURRENT_TIMESTAMP`),
	check("last_modified_at_check", sql`last_modified_at <= CURRENT_TIMESTAMP`),
	check("technological_map_map_id_not_null", sql`NOT NULL map_id`),
	check("technological_map_title_not_null", sql`NOT NULL title`),
]);

export const productionTaskInSales = sales.table("production_task", {
	taskId: serial("task_id").primaryKey().notNull(),
	publicTaskId: uuid("public_task_id").defaultRandom().notNull(),
	title: varchar({ length: 255 }).notNull(),
	mapId: integer("map_id").notNull(),
	assignedTo: integer("assigned_to"),
	unit: unitInProductionFlow().notNull(),
	quantity: numeric({ precision: 10, scale:  2 }).default('0.00').notNull(),
	price: numeric({ precision: 10, scale:  2 }).default('0.00').notNull(),
	startDate: date("start_date"),
	deadline: date(),
	status: statusInSales().default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedAt: timestamp("last_modified_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedBy: integer("last_modified_by"),
}, (table) => [
	foreignKey({
			columns: [table.mapId],
			foreignColumns: [technologicalMapInProductionFlow.mapId],
			name: "production_task_map_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.assignedTo],
			foreignColumns: [userInUserManagement.userId],
			name: "production_task_assigned_to_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.lastModifiedBy],
			foreignColumns: [userInUserManagement.userId],
			name: "production_task_last_modified_by_fkey"
		}).onDelete("set null"),
	unique("production_task_public_task_id_key").on(table.publicTaskId),
	check("title_check", sql`(title)::text <> ''::text`),
	check("quantity_check", sql`quantity >= (0)::numeric`),
	check("price_check", sql`price >= (0)::numeric`),
	check("created_at_check", sql`created_at <= CURRENT_TIMESTAMP`),
	check("last_modified_at_check", sql`last_modified_at <= CURRENT_TIMESTAMP`),
	check("production_task_task_id_not_null", sql`NOT NULL task_id`),
	check("production_task_public_task_id_not_null", sql`NOT NULL public_task_id`),
	check("production_task_title_not_null", sql`NOT NULL title`),
	check("production_task_map_id_not_null", sql`NOT NULL map_id`),
	check("production_task_unit_not_null", sql`NOT NULL unit`),
	check("production_task_quantity_not_null", sql`NOT NULL quantity`),
	check("production_task_price_not_null", sql`NOT NULL price`),
	check("production_task_status_not_null", sql`NOT NULL status`),
]);

export const orderInSales = sales.table("order", {
	orderId: serial("order_id").primaryKey().notNull(),
	publicOrderId: uuid("public_order_id").defaultRandom().notNull(),
	clientId: integer("client_id"),
	comment: text().notNull(),
	status: statusInSales().default('pending').notNull(),
	totalPrice: numeric("total_price", { precision: 10, scale:  2 }).default('0.00').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedAt: timestamp("last_modified_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastModifiedBy: integer("last_modified_by"),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clientInfoInUserManagement.clientId],
			name: "order_client_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.lastModifiedBy],
			foreignColumns: [userInUserManagement.userId],
			name: "order_last_modified_by_fkey"
		}).onDelete("set null"),
	unique("order_public_order_id_key").on(table.publicOrderId),
	check("total_price_check", sql`total_price >= (0)::numeric`),
	check("created_at_check", sql`created_at <= CURRENT_TIMESTAMP`),
	check("last_modified_at_check", sql`last_modified_at <= CURRENT_TIMESTAMP`),
	check("order_order_id_not_null", sql`NOT NULL order_id`),
	check("order_public_order_id_not_null", sql`NOT NULL public_order_id`),
	check("order_comment_not_null", sql`NOT NULL comment`),
	check("order_status_not_null", sql`NOT NULL status`),
	check("order_total_price_not_null", sql`NOT NULL total_price`),
]);

export const rolePermissionInUserManagement = userManagement.table("role_permission", {
	roleId: integer("role_id").notNull(),
	permissionId: integer("permission_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roleInUserManagement.roleId],
			name: "role_permission_role_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permissionInUserManagement.permissionId],
			name: "role_permission_permission_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.roleId, table.permissionId], name: "role_permission_pkey"}),
	check("role_permission_role_id_not_null", sql`NOT NULL role_id`),
	check("role_permission_permission_id_not_null", sql`NOT NULL permission_id`),
]);

export const equipmentTaskTypeInProductionFlow = productionFlow.table("equipment_task_type", {
	specsId: integer("specs_id").notNull(),
	taskTypeId: integer("task_type_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.specsId],
			foreignColumns: [equipmentSpecsInProductionFlow.specsId],
			name: "equipment_task_type_specs_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.taskTypeId],
			foreignColumns: [taskTypeInProductionFlow.taskTypeId],
			name: "equipment_task_type_task_type_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.taskTypeId, table.specsId], name: "equipment_task_type_pkey"}),
	check("equipment_task_type_specs_id_not_null", sql`NOT NULL specs_id`),
	check("equipment_task_type_task_type_id_not_null", sql`NOT NULL task_type_id`),
]);

export const technologicalMapEquipmentInProductionFlow = productionFlow.table("technological_map_equipment", {
	mapId: integer("map_id").notNull(),
	equipmentId: integer("equipment_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.mapId],
			foreignColumns: [technologicalMapInProductionFlow.mapId],
			name: "technological_map_equipment_map_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.equipmentId],
			foreignColumns: [equipmentInProductionFlow.equipmentId],
			name: "technological_map_equipment_equipment_id_fkey"
		}).onDelete("restrict"),
	primaryKey({ columns: [table.mapId, table.equipmentId], name: "technological_map_equipment_pkey"}),
	check("technological_map_equipment_equipment_id_not_null", sql`NOT NULL equipment_id`),
	check("technological_map_equipment_map_id_not_null", sql`NOT NULL map_id`),
]);

export const technologicalMapAttachmentInProductionFlow = productionFlow.table("technological_map_attachment", {
	mapId: integer("map_id").notNull(),
	fileId: uuid("file_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.mapId],
			foreignColumns: [technologicalMapInProductionFlow.mapId],
			name: "technological_map_attachment_map_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.fileId],
			foreignColumns: [fileInFileStorage.fileId],
			name: "technological_map_attachment_file_id_fkey"
		}).onDelete("restrict"),
	primaryKey({ columns: [table.mapId, table.fileId], name: "technological_map_attachment_pkey"}),
	check("technological_map_attachment_map_id_not_null", sql`NOT NULL map_id`),
	check("technological_map_attachment_file_id_not_null", sql`NOT NULL file_id`),
]);

export const orderTaskInSales = sales.table("order_task", {
	orderId: integer("order_id").notNull(),
	taskId: integer("task_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orderInSales.orderId],
			name: "order_task_order_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.taskId],
			foreignColumns: [productionTaskInSales.taskId],
			name: "order_task_task_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.taskId, table.orderId], name: "order_task_pkey"}),
	check("order_task_order_id_not_null", sql`NOT NULL order_id`),
	check("order_task_task_id_not_null", sql`NOT NULL task_id`),
]);

export const clientRequestFileInUserManagement = userManagement.table("client_request_file", {
	requestId: uuid("request_id").notNull(),
	fileId: uuid("file_id").notNull(),
	uploadedAt: timestamp("uploaded_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.requestId],
			foreignColumns: [clientRequestInUserManagement.requestId],
			name: "client_request_file_request_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.fileId],
			foreignColumns: [fileInFileStorage.fileId],
			name: "client_request_file_file_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.requestId, table.fileId], name: "client_request_file_pkey"}),
	check("client_request_file_request_id_not_null", sql`NOT NULL request_id`),
	check("client_request_file_file_id_not_null", sql`NOT NULL file_id`),
]);

export const technologicalMapMaterialInProductionFlow = productionFlow.table("technological_map_material", {
	mapId: integer("map_id").notNull(),
	materialId: integer("material_id").notNull(),
	quantity: numeric({ precision: 10, scale:  2 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.mapId],
			foreignColumns: [technologicalMapInProductionFlow.mapId],
			name: "technological_map_material_map_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.materialId],
			foreignColumns: [materialInProductionFlow.materialId],
			name: "technological_map_material_material_id_fkey"
		}).onDelete("restrict"),
	primaryKey({ columns: [table.materialId, table.mapId], name: "technological_map_material_pkey"}),
	check("technological_map_material_quantity_not_null", sql`NOT NULL quantity`),
	check("technological_map_material_map_id_not_null", sql`NOT NULL map_id`),
	check("technological_map_material_material_id_not_null", sql`NOT NULL material_id`),
]);

export const userRoleInUserManagement = userManagement.table("user_role", {
	userId: integer("user_id").notNull(),
	roleId: integer("role_id").notNull(),
	assignedAt: timestamp("assigned_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	assignedBy: integer("assigned_by"),
	isActive: boolean("is_active").default(true),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [userInUserManagement.userId],
			name: "user_role_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roleInUserManagement.roleId],
			name: "user_role_role_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.assignedBy],
			foreignColumns: [userInUserManagement.userId],
			name: "user_role_assigned_by_fkey"
		}).onDelete("set null"),
	primaryKey({ columns: [table.userId, table.roleId], name: "user_role_pkey"}),
	check("user_role_user_id_not_null", sql`NOT NULL user_id`),
	check("user_role_role_id_not_null", sql`NOT NULL role_id`),
]);
