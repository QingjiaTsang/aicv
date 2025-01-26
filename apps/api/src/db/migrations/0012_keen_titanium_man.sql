PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_document` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text(255) NOT NULL,
	`summary` text(1000),
	`theme_color` text DEFAULT '#7c3aed' NOT NULL,
	`thumbnail` text,
	`current_position` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'private' NOT NULL,
	`section_order` text DEFAULT 'experience,education,skills' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_document`("id", "user_id", "title", "summary", "theme_color", "thumbnail", "current_position", "status", "section_order", "created_at", "updated_at") SELECT "id", "user_id", "title", "summary", "theme_color", "thumbnail", "current_position", "status", "section_order", "created_at", "updated_at" FROM `document`;--> statement-breakpoint
DROP TABLE `document`;--> statement-breakpoint
ALTER TABLE `__new_document` RENAME TO `document`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `document` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_created_at_idx` ON `document` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `user_updated_at_idx` ON `document` (`user_id`,`updated_at`);--> statement-breakpoint
CREATE INDEX `user_status_idx` ON `document` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `user_title_idx` ON `document` (`user_id`,`title`);--> statement-breakpoint
CREATE TABLE `__new_education` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`document_id` text NOT NULL,
	`university_name` text(255),
	`degree` text(255),
	`major` text(255),
	`description` text(10000),
	`display_order` integer DEFAULT 0 NOT NULL,
	`start_date` text,
	`end_date` text,
	FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_education`("id", "created_at", "updated_at", "document_id", "university_name", "degree", "major", "description", "display_order", "start_date", "end_date") SELECT "id", "created_at", "updated_at", "document_id", "university_name", "degree", "major", "description", "display_order", "start_date", "end_date" FROM `education`;--> statement-breakpoint
DROP TABLE `education`;--> statement-breakpoint
ALTER TABLE `__new_education` RENAME TO `education`;--> statement-breakpoint
CREATE TABLE `__new_experience` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`document_id` text NOT NULL,
	`title` text(255),
	`company_name` text(255),
	`state` text(255),
	`city` text(255),
	`is_currently_employed` integer DEFAULT false NOT NULL,
	`work_summary` text(10000),
	`display_order` integer DEFAULT 0 NOT NULL,
	`start_date` text,
	`end_date` text,
	FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_experience`("id", "created_at", "updated_at", "document_id", "title", "company_name", "state", "city", "is_currently_employed", "work_summary", "display_order", "start_date", "end_date") SELECT "id", "created_at", "updated_at", "document_id", "title", "company_name", "state", "city", "is_currently_employed", "work_summary", "display_order", "start_date", "end_date" FROM `experience`;--> statement-breakpoint
DROP TABLE `experience`;--> statement-breakpoint
ALTER TABLE `__new_experience` RENAME TO `experience`;--> statement-breakpoint
CREATE TABLE `__new_personal_info` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`document_id` text NOT NULL,
	`first_name` text(50),
	`last_name` text(50),
	`job_title` text(255),
	`state` text(255),
	`city` text(255),
	`phone` text(11),
	`email` text(255),
	FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_personal_info`("id", "created_at", "updated_at", "document_id", "first_name", "last_name", "job_title", "state", "city", "phone", "email") SELECT "id", "created_at", "updated_at", "document_id", "first_name", "last_name", "job_title", "state", "city", "phone", "email" FROM `personal_info`;--> statement-breakpoint
DROP TABLE `personal_info`;--> statement-breakpoint
ALTER TABLE `__new_personal_info` RENAME TO `personal_info`;--> statement-breakpoint
CREATE UNIQUE INDEX `personal_info_document_id_unique` ON `personal_info` (`document_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `document_id_unique_idx` ON `personal_info` (`document_id`);--> statement-breakpoint
CREATE INDEX `phone_idx` ON `personal_info` (`phone`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `personal_info` (`email`);--> statement-breakpoint
CREATE TABLE `__new_skills` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`documentId` text NOT NULL,
	`name` text,
	`rating` integer DEFAULT 0 NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`documentId`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_skills`("id", "created_at", "updated_at", "documentId", "name", "rating", "display_order") SELECT "id", "created_at", "updated_at", "documentId", "name", "rating", "display_order" FROM `skills`;--> statement-breakpoint
DROP TABLE `skills`;--> statement-breakpoint
ALTER TABLE `__new_skills` RENAME TO `skills`;