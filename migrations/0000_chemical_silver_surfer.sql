-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "user_management";
--> statement-breakpoint
CREATE SCHEMA "file_storage";
--> statement-breakpoint
CREATE SCHEMA "production_flow";
--> statement-breakpoint
CREATE SCHEMA "sales";
--> statement-breakpoint
CREATE TYPE "production_flow"."equipment_status" AS ENUM('operational', 'need in service', 'out of service');--> statement-breakpoint
CREATE TYPE "production_flow"."unit" AS ENUM('g', 'kg', 'm', 'mm', 'l', 'ml');--> statement-breakpoint
CREATE TYPE "sales"."status" AS ENUM('pending', 'in progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "user_management"."client_request_status" AS ENUM('new', 'in_review', 'approved', 'rejected', 'account_created');--> statement-breakpoint
CREATE TYPE "user_management"."user_status" AS ENUM('active', 'inactive', 'suspended', 'pending_activation');--> statement-breakpoint
CREATE TABLE "user_management"."role" (
	"role_id" serial PRIMARY KEY NOT NULL,
	"role_name" varchar(50) NOT NULL,
	"description" varchar(255),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "role_role_name_key" UNIQUE("role_name"),
	CONSTRAINT "role_name_check" CHECK ((role_name)::text <> ''::text),
	CONSTRAINT "created_at_check" CHECK (created_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "role_role_id_not_null" CHECK (NOT NULL role_id),
	CONSTRAINT "role_role_name_not_null" CHECK (NOT NULL role_name)
);
--> statement-breakpoint
CREATE TABLE "user_management"."permission" (
	"permission_id" serial PRIMARY KEY NOT NULL,
	"permission_name" varchar(100) NOT NULL,
	"description" varchar(255),
	"resource" varchar(50) NOT NULL,
	"action" varchar(50) NOT NULL,
	CONSTRAINT "permission_permission_name_key" UNIQUE("permission_name"),
	CONSTRAINT "permission_name_check" CHECK ((permission_name)::text <> ''::text),
	CONSTRAINT "resource_check" CHECK ((resource)::text <> ''::text),
	CONSTRAINT "action_check" CHECK ((action)::text <> ''::text),
	CONSTRAINT "permission_permission_id_not_null" CHECK (NOT NULL permission_id),
	CONSTRAINT "permission_permission_name_not_null" CHECK (NOT NULL permission_name),
	CONSTRAINT "permission_resource_not_null" CHECK (NOT NULL resource),
	CONSTRAINT "permission_action_not_null" CHECK (NOT NULL action)
);
--> statement-breakpoint
CREATE TABLE "user_management"."client_request" (
	"request_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"contact_person" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(20),
	"business_type" varchar(100),
	"description" text,
	"status" "user_management"."client_request_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"reviewed_at" timestamp,
	"reviewed_by" integer,
	"rejection_reason" text,
	"created_user_id" integer,
	"notes" text,
	CONSTRAINT "company_name_check" CHECK ((company_name)::text <> ''::text),
	CONSTRAINT "contact_person_check" CHECK ((contact_person)::text <> ''::text),
	CONSTRAINT "email_check" CHECK (((email)::text <> ''::text) AND ((email)::text ~~ '%@%'::text)),
	CONSTRAINT "created_at_check" CHECK (created_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "client_request_request_id_not_null" CHECK (NOT NULL request_id),
	CONSTRAINT "client_request_company_name_not_null" CHECK (NOT NULL company_name),
	CONSTRAINT "client_request_contact_person_not_null" CHECK (NOT NULL contact_person),
	CONSTRAINT "client_request_email_not_null" CHECK (NOT NULL email),
	CONSTRAINT "client_request_status_not_null" CHECK (NOT NULL status)
);
--> statement-breakpoint
CREATE TABLE "user_management"."user" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"password_salt" varchar(255) NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"middle_name" varchar(50),
	"phone" varchar(20),
	"position" varchar(100),
	"department" varchar(100),
	"hire_date" date,
	"status" "user_management"."user_status" DEFAULT 'pending_activation' NOT NULL,
	"last_login" timestamp,
	"failed_login_attempts" integer DEFAULT 0,
	"password_reset_token" varchar(255),
	"password_reset_expires" timestamp,
	"two_factor_enabled" boolean DEFAULT false,
	"two_factor_secret" varchar(255),
	"two_factor_backup_codes" text[],
	"temp_verification_code" varchar(6),
	"temp_code_expires" timestamp,
	"temp_code_type" varchar(50),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_by" integer,
	"is_archived" boolean DEFAULT false,
	CONSTRAINT "user_username_key" UNIQUE("username"),
	CONSTRAINT "user_email_key" UNIQUE("email"),
	CONSTRAINT "username_check" CHECK ((username)::text <> ''::text),
	CONSTRAINT "email_check" CHECK (((email)::text <> ''::text) AND ((email)::text ~~ '%@%'::text)),
	CONSTRAINT "password_hash_check" CHECK ((password_hash)::text <> ''::text),
	CONSTRAINT "password_salt_check" CHECK ((password_salt)::text <> ''::text),
	CONSTRAINT "first_name_check" CHECK ((first_name)::text <> ''::text),
	CONSTRAINT "last_name_check" CHECK ((last_name)::text <> ''::text),
	CONSTRAINT "failed_login_attempts_check" CHECK (failed_login_attempts >= 0),
	CONSTRAINT "created_at_check" CHECK (created_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "last_modified_at_check" CHECK (last_modified_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "user_user_id_not_null" CHECK (NOT NULL user_id),
	CONSTRAINT "user_username_not_null" CHECK (NOT NULL username),
	CONSTRAINT "user_email_not_null" CHECK (NOT NULL email),
	CONSTRAINT "user_password_hash_not_null" CHECK (NOT NULL password_hash),
	CONSTRAINT "user_password_salt_not_null" CHECK (NOT NULL password_salt),
	CONSTRAINT "user_first_name_not_null" CHECK (NOT NULL first_name),
	CONSTRAINT "user_last_name_not_null" CHECK (NOT NULL last_name),
	CONSTRAINT "user_status_not_null" CHECK (NOT NULL status)
);
--> statement-breakpoint
CREATE TABLE "user_management"."user_session" (
	"session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"ip_address" "inet",
	"user_agent" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"expires_at" timestamp NOT NULL,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "created_at_check" CHECK (created_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "expires_at_check" CHECK (expires_at > created_at),
	CONSTRAINT "user_session_session_id_not_null" CHECK (NOT NULL session_id),
	CONSTRAINT "user_session_user_id_not_null" CHECK (NOT NULL user_id),
	CONSTRAINT "user_session_expires_at_not_null" CHECK (NOT NULL expires_at)
);
--> statement-breakpoint
CREATE TABLE "user_management"."client_info" (
	"client_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"business_type" varchar(100),
	"tax_number" varchar(50),
	"registration_number" varchar(50),
	"legal_address" text,
	"billing_address" text,
	"contact_person" varchar(100),
	"contact_phone" varchar(20),
	"contact_email" varchar(100),
	"payment_terms" integer DEFAULT 30,
	"credit_limit" numeric(12, 2) DEFAULT '0.00',
	"discount_percentage" numeric(5, 2) DEFAULT '0.00',
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_by" integer,
	CONSTRAINT "client_info_user_id_key" UNIQUE("user_id"),
	CONSTRAINT "company_name_check" CHECK ((company_name)::text <> ''::text),
	CONSTRAINT "payment_terms_check" CHECK (payment_terms > 0),
	CONSTRAINT "credit_limit_check" CHECK (credit_limit >= (0)::numeric),
	CONSTRAINT "discount_percentage_check" CHECK ((discount_percentage >= (0)::numeric) AND (discount_percentage <= (100)::numeric)),
	CONSTRAINT "created_at_check" CHECK (created_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "last_modified_at_check" CHECK (last_modified_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "client_info_client_id_not_null" CHECK (NOT NULL client_id),
	CONSTRAINT "client_info_user_id_not_null" CHECK (NOT NULL user_id),
	CONSTRAINT "client_info_company_name_not_null" CHECK (NOT NULL company_name)
);
--> statement-breakpoint
CREATE TABLE "file_storage"."file" (
	"file_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_path" varchar(512) NOT NULL,
	"file_size" bigint NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"bucket_name" varchar(50) NOT NULL,
	"hash" varchar(255) NOT NULL,
	"uploaded_by" integer,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"is_archived" boolean DEFAULT false,
	"temp_session_id" uuid DEFAULT gen_random_uuid(),
	"temp_email" varchar(100),
	CONSTRAINT "file_name_check" CHECK ((file_name)::text <> ''::text),
	CONSTRAINT "mime_type_check" CHECK ((mime_type)::text <> ''::text),
	CONSTRAINT "bucket_name_check" CHECK ((bucket_name)::text <> ''::text),
	CONSTRAINT "hash_check" CHECK ((hash)::text <> ''::text),
	CONSTRAINT "created_at_check" CHECK (created_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "file_file_id_not_null" CHECK (NOT NULL file_id),
	CONSTRAINT "file_file_name_not_null" CHECK (NOT NULL file_name),
	CONSTRAINT "file_file_path_not_null" CHECK (NOT NULL file_path),
	CONSTRAINT "file_file_size_not_null" CHECK (NOT NULL file_size),
	CONSTRAINT "file_mime_type_not_null" CHECK (NOT NULL mime_type),
	CONSTRAINT "file_bucket_name_not_null" CHECK (NOT NULL bucket_name),
	CONSTRAINT "file_hash_not_null" CHECK (NOT NULL hash)
);
--> statement-breakpoint
CREATE TABLE "production_flow"."material_category" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(512) NOT NULL,
	CONSTRAINT "title_check" CHECK ((title)::text <> ''::text),
	CONSTRAINT "description_check" CHECK ((description)::text <> ''::text),
	CONSTRAINT "material_category_category_id_not_null" CHECK (NOT NULL category_id),
	CONSTRAINT "material_category_title_not_null" CHECK (NOT NULL title),
	CONSTRAINT "material_category_description_not_null" CHECK (NOT NULL description)
);
--> statement-breakpoint
CREATE TABLE "production_flow"."material" (
	"material_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"category_id" integer,
	"quantity" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"unit" "production_flow"."unit" NOT NULL,
	"cost_per_unit" numeric(10, 10) DEFAULT '0.00' NOT NULL,
	"minimum_stock" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_by" integer,
	CONSTRAINT "title_check" CHECK ((title)::text <> ''::text),
	CONSTRAINT "quantity_check" CHECK (quantity >= (0)::numeric),
	CONSTRAINT "cost_per_unit_check" CHECK (cost_per_unit >= (0)::numeric),
	CONSTRAINT "minimum_stock_check" CHECK (minimum_stock >= (0)::numeric),
	CONSTRAINT "created_at_check" CHECK (created_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "last_modified_at_check" CHECK (last_modified_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "material_material_id_not_null" CHECK (NOT NULL material_id),
	CONSTRAINT "material_title_not_null" CHECK (NOT NULL title),
	CONSTRAINT "material_quantity_not_null" CHECK (NOT NULL quantity),
	CONSTRAINT "material_unit_not_null" CHECK (NOT NULL unit),
	CONSTRAINT "material_cost_per_unit_not_null" CHECK (NOT NULL cost_per_unit),
	CONSTRAINT "material_minimum_stock_not_null" CHECK (NOT NULL minimum_stock)
);
--> statement-breakpoint
CREATE TABLE "production_flow"."equipment_specs" (
	"specs_id" serial PRIMARY KEY NOT NULL,
	"technical_specs" jsonb,
	"cost" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_by" integer,
	"is_archived" boolean DEFAULT false,
	CONSTRAINT "cost_check" CHECK (cost >= (0)::numeric),
	CONSTRAINT "created_at_check" CHECK (created_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "last_modified_at_check" CHECK (last_modified_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "equipment_specs_specs_id_not_null" CHECK (NOT NULL specs_id),
	CONSTRAINT "equipment_specs_cost_not_null" CHECK (NOT NULL cost)
);
--> statement-breakpoint
CREATE TABLE "production_flow"."equipment" (
	"equipment_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"specs_id" integer,
	"last_service_date" date,
	"next_service_date" date,
	"status" "production_flow"."equipment_status" NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_by" integer,
	"is_archived" boolean DEFAULT false,
	CONSTRAINT "title_check" CHECK ((title)::text <> ''::text),
	CONSTRAINT "next_service_date_check" CHECK ((next_service_date IS NULL) OR (next_service_date >= CURRENT_DATE)),
	CONSTRAINT "created_at_check" CHECK (created_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "last_modified_at_check" CHECK (last_modified_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "equipment_equipment_id_not_null" CHECK (NOT NULL equipment_id),
	CONSTRAINT "equipment_title_not_null" CHECK (NOT NULL title),
	CONSTRAINT "equipment_status_not_null" CHECK (NOT NULL status)
);
--> statement-breakpoint
CREATE TABLE "production_flow"."task_type" (
	"task_type_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text,
	CONSTRAINT "task_type_title_key" UNIQUE("title"),
	CONSTRAINT "title_check" CHECK ((title)::text <> ''::text),
	CONSTRAINT "task_type_task_type_id_not_null" CHECK (NOT NULL task_type_id),
	CONSTRAINT "task_type_title_not_null" CHECK (NOT NULL title)
);
--> statement-breakpoint
CREATE TABLE "production_flow"."technological_map" (
	"map_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_by" integer,
	"is_archived" boolean DEFAULT false,
	CONSTRAINT "title_check" CHECK ((title)::text <> ''::text),
	CONSTRAINT "created_at_check" CHECK (created_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "last_modified_at_check" CHECK (last_modified_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "technological_map_map_id_not_null" CHECK (NOT NULL map_id),
	CONSTRAINT "technological_map_title_not_null" CHECK (NOT NULL title)
);
--> statement-breakpoint
CREATE TABLE "sales"."production_task" (
	"task_id" serial PRIMARY KEY NOT NULL,
	"public_task_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"map_id" integer NOT NULL,
	"assigned_to" integer,
	"unit" "production_flow"."unit" NOT NULL,
	"quantity" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"start_date" date,
	"deadline" date,
	"status" "sales"."status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_by" integer,
	CONSTRAINT "production_task_public_task_id_key" UNIQUE("public_task_id"),
	CONSTRAINT "title_check" CHECK ((title)::text <> ''::text),
	CONSTRAINT "quantity_check" CHECK (quantity >= (0)::numeric),
	CONSTRAINT "price_check" CHECK (price >= (0)::numeric),
	CONSTRAINT "created_at_check" CHECK (created_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "last_modified_at_check" CHECK (last_modified_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "production_task_task_id_not_null" CHECK (NOT NULL task_id),
	CONSTRAINT "production_task_public_task_id_not_null" CHECK (NOT NULL public_task_id),
	CONSTRAINT "production_task_title_not_null" CHECK (NOT NULL title),
	CONSTRAINT "production_task_map_id_not_null" CHECK (NOT NULL map_id),
	CONSTRAINT "production_task_unit_not_null" CHECK (NOT NULL unit),
	CONSTRAINT "production_task_quantity_not_null" CHECK (NOT NULL quantity),
	CONSTRAINT "production_task_price_not_null" CHECK (NOT NULL price),
	CONSTRAINT "production_task_status_not_null" CHECK (NOT NULL status)
);
--> statement-breakpoint
CREATE TABLE "sales"."order" (
	"order_id" serial PRIMARY KEY NOT NULL,
	"public_order_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"client_id" integer,
	"comment" text NOT NULL,
	"status" "sales"."status" DEFAULT 'pending' NOT NULL,
	"total_price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_modified_by" integer,
	CONSTRAINT "order_public_order_id_key" UNIQUE("public_order_id"),
	CONSTRAINT "total_price_check" CHECK (total_price >= (0)::numeric),
	CONSTRAINT "created_at_check" CHECK (created_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "last_modified_at_check" CHECK (last_modified_at <= CURRENT_TIMESTAMP),
	CONSTRAINT "order_order_id_not_null" CHECK (NOT NULL order_id),
	CONSTRAINT "order_public_order_id_not_null" CHECK (NOT NULL public_order_id),
	CONSTRAINT "order_comment_not_null" CHECK (NOT NULL comment),
	CONSTRAINT "order_status_not_null" CHECK (NOT NULL status),
	CONSTRAINT "order_total_price_not_null" CHECK (NOT NULL total_price)
);
--> statement-breakpoint
CREATE TABLE "user_management"."role_permission" (
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	CONSTRAINT "role_permission_pkey" PRIMARY KEY("role_id","permission_id"),
	CONSTRAINT "role_permission_role_id_not_null" CHECK (NOT NULL role_id),
	CONSTRAINT "role_permission_permission_id_not_null" CHECK (NOT NULL permission_id)
);
--> statement-breakpoint
CREATE TABLE "production_flow"."equipment_task_type" (
	"specs_id" integer NOT NULL,
	"task_type_id" integer NOT NULL,
	CONSTRAINT "equipment_task_type_pkey" PRIMARY KEY("task_type_id","specs_id"),
	CONSTRAINT "equipment_task_type_specs_id_not_null" CHECK (NOT NULL specs_id),
	CONSTRAINT "equipment_task_type_task_type_id_not_null" CHECK (NOT NULL task_type_id)
);
--> statement-breakpoint
CREATE TABLE "production_flow"."technological_map_equipment" (
	"map_id" integer NOT NULL,
	"equipment_id" integer NOT NULL,
	CONSTRAINT "technological_map_equipment_pkey" PRIMARY KEY("map_id","equipment_id"),
	CONSTRAINT "technological_map_equipment_equipment_id_not_null" CHECK (NOT NULL equipment_id),
	CONSTRAINT "technological_map_equipment_map_id_not_null" CHECK (NOT NULL map_id)
);
--> statement-breakpoint
CREATE TABLE "production_flow"."technological_map_attachment" (
	"map_id" integer NOT NULL,
	"file_id" uuid NOT NULL,
	CONSTRAINT "technological_map_attachment_pkey" PRIMARY KEY("map_id","file_id"),
	CONSTRAINT "technological_map_attachment_map_id_not_null" CHECK (NOT NULL map_id),
	CONSTRAINT "technological_map_attachment_file_id_not_null" CHECK (NOT NULL file_id)
);
--> statement-breakpoint
CREATE TABLE "sales"."order_task" (
	"order_id" integer NOT NULL,
	"task_id" integer NOT NULL,
	CONSTRAINT "order_task_pkey" PRIMARY KEY("task_id","order_id"),
	CONSTRAINT "order_task_order_id_not_null" CHECK (NOT NULL order_id),
	CONSTRAINT "order_task_task_id_not_null" CHECK (NOT NULL task_id)
);
--> statement-breakpoint
CREATE TABLE "user_management"."client_request_file" (
	"request_id" uuid NOT NULL,
	"file_id" uuid NOT NULL,
	"uploaded_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "client_request_file_pkey" PRIMARY KEY("request_id","file_id"),
	CONSTRAINT "client_request_file_request_id_not_null" CHECK (NOT NULL request_id),
	CONSTRAINT "client_request_file_file_id_not_null" CHECK (NOT NULL file_id)
);
--> statement-breakpoint
CREATE TABLE "production_flow"."technological_map_material" (
	"map_id" integer NOT NULL,
	"material_id" integer NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	CONSTRAINT "technological_map_material_pkey" PRIMARY KEY("material_id","map_id"),
	CONSTRAINT "technological_map_material_quantity_not_null" CHECK (NOT NULL quantity),
	CONSTRAINT "technological_map_material_map_id_not_null" CHECK (NOT NULL map_id),
	CONSTRAINT "technological_map_material_material_id_not_null" CHECK (NOT NULL material_id)
);
--> statement-breakpoint
CREATE TABLE "user_management"."user_role" (
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"assigned_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"assigned_by" integer,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "user_role_pkey" PRIMARY KEY("user_id","role_id"),
	CONSTRAINT "user_role_user_id_not_null" CHECK (NOT NULL user_id),
	CONSTRAINT "user_role_role_id_not_null" CHECK (NOT NULL role_id)
);
--> statement-breakpoint
ALTER TABLE "user_management"."client_request" ADD CONSTRAINT "client_request_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "user_management"."user"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."client_request" ADD CONSTRAINT "client_request_created_user_id_fkey" FOREIGN KEY ("created_user_id") REFERENCES "user_management"."user"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."user_session" ADD CONSTRAINT "user_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_management"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."client_info" ADD CONSTRAINT "client_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_management"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."client_info" ADD CONSTRAINT "client_info_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "user_management"."user"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_storage"."file" ADD CONSTRAINT "file_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "user_management"."user"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."material" ADD CONSTRAINT "material_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "production_flow"."material_category"("category_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."material" ADD CONSTRAINT "material_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "user_management"."user"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."equipment_specs" ADD CONSTRAINT "equipment_specs_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "user_management"."user"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."equipment" ADD CONSTRAINT "equipment_specs_id_fkey" FOREIGN KEY ("specs_id") REFERENCES "production_flow"."equipment_specs"("specs_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."equipment" ADD CONSTRAINT "equipment_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "user_management"."user"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."technological_map" ADD CONSTRAINT "technological_map_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "user_management"."user"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales"."production_task" ADD CONSTRAINT "production_task_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "production_flow"."technological_map"("map_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales"."production_task" ADD CONSTRAINT "production_task_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "user_management"."user"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales"."production_task" ADD CONSTRAINT "production_task_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "user_management"."user"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales"."order" ADD CONSTRAINT "order_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "user_management"."client_info"("client_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales"."order" ADD CONSTRAINT "order_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "user_management"."user"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_management"."role"("role_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "user_management"."permission"("permission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."equipment_task_type" ADD CONSTRAINT "equipment_task_type_specs_id_fkey" FOREIGN KEY ("specs_id") REFERENCES "production_flow"."equipment_specs"("specs_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."equipment_task_type" ADD CONSTRAINT "equipment_task_type_task_type_id_fkey" FOREIGN KEY ("task_type_id") REFERENCES "production_flow"."task_type"("task_type_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."technological_map_equipment" ADD CONSTRAINT "technological_map_equipment_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "production_flow"."technological_map"("map_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."technological_map_equipment" ADD CONSTRAINT "technological_map_equipment_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "production_flow"."equipment"("equipment_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."technological_map_attachment" ADD CONSTRAINT "technological_map_attachment_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "production_flow"."technological_map"("map_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."technological_map_attachment" ADD CONSTRAINT "technological_map_attachment_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file_storage"."file"("file_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales"."order_task" ADD CONSTRAINT "order_task_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "sales"."order"("order_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales"."order_task" ADD CONSTRAINT "order_task_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "sales"."production_task"("task_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."client_request_file" ADD CONSTRAINT "client_request_file_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "user_management"."client_request"("request_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."client_request_file" ADD CONSTRAINT "client_request_file_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file_storage"."file"("file_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."technological_map_material" ADD CONSTRAINT "technological_map_material_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "production_flow"."technological_map"("map_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_flow"."technological_map_material" ADD CONSTRAINT "technological_map_material_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "production_flow"."material"("material_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_management"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_management"."role"("role_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."user_role" ADD CONSTRAINT "user_role_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "user_management"."user"("user_id") ON DELETE set null ON UPDATE no action;
*/