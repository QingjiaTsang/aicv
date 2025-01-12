PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_document` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`user_id` text NOT NULL,
	`title` text(255) NOT NULL,
	`summary` text(1000),
	`theme_color` text DEFAULT '#7c3aed' NOT NULL,
	`thumbnail` text,
	`current_position` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'private' NOT NULL,
	`author_name` text(255) NOT NULL,
	`author_email` text(255) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_document`("id", "createdAt", "updatedAt", "user_id", "title", "summary", "theme_color", "thumbnail", "current_position", "status", "author_name", "author_email") SELECT "id", "createdAt", "updatedAt", "user_id", "title", "summary", "theme_color", "thumbnail", "current_position", "status", "author_name", "author_email" FROM `document`;--> statement-breakpoint
DROP TABLE `document`;--> statement-breakpoint
ALTER TABLE `__new_document` RENAME TO `document`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `user_status_idx` ON `document` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `document` (`title`);--> statement-breakpoint
CREATE INDEX `author_name_idx` ON `document` (`author_name`);--> statement-breakpoint
CREATE INDEX `author_email_idx` ON `document` (`author_email`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `document` (`createdAt`);--> statement-breakpoint
CREATE INDEX `updated_at_idx` ON `document` (`updatedAt`);--> statement-breakpoint
CREATE TABLE `__new_education` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`document_id` text NOT NULL,
	`university_name` text(255),
	`degree` text(255),
	`major` text(255),
	`description` text(1000),
	`start_date` integer,
	`end_date` integer,
	FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_education`("id", "createdAt", "updatedAt", "document_id", "university_name", "degree", "major", "description", "start_date", "end_date") SELECT "id", "createdAt", "updatedAt", "document_id", "university_name", "degree", "major", "description", "start_date", "end_date" FROM `education`;--> statement-breakpoint
DROP TABLE `education`;--> statement-breakpoint
ALTER TABLE `__new_education` RENAME TO `education`;--> statement-breakpoint
CREATE TABLE `__new_experience` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`document_id` text NOT NULL,
	`title` text(255),
	`company_name` text(255),
	`state` text(255),
	`city` text(255),
	`is_currently_employed` integer DEFAULT false NOT NULL,
	`work_summary` text(2000),
	`start_date` integer,
	`end_date` integer,
	FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_experience`("id", "createdAt", "updatedAt", "document_id", "title", "company_name", "state", "city", "is_currently_employed", "work_summary", "start_date", "end_date") SELECT "id", "createdAt", "updatedAt", "document_id", "title", "company_name", "state", "city", "is_currently_employed", "work_summary", "start_date", "end_date" FROM `experience`;--> statement-breakpoint
DROP TABLE `experience`;--> statement-breakpoint
ALTER TABLE `__new_experience` RENAME TO `experience`;--> statement-breakpoint
CREATE TABLE `__new_personal_info` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`document_id` text NOT NULL,
	`first_name` text(50),
	`last_name` text(50),
	`job_title` text(255),
	`city` text(255),
	`address` text(500),
	`phone` text(11),
	`email` text(255),
	FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_personal_info`("id", "createdAt", "updatedAt", "document_id", "first_name", "last_name", "job_title", "city", "address", "phone", "email") SELECT "id", "createdAt", "updatedAt", "document_id", "first_name", "last_name", "job_title", "city", "address", "phone", "email" FROM `personal_info`;--> statement-breakpoint
DROP TABLE `personal_info`;--> statement-breakpoint
ALTER TABLE `__new_personal_info` RENAME TO `personal_info`;--> statement-breakpoint
CREATE INDEX `phone_idx` ON `personal_info` (`phone`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `personal_info` (`email`);--> statement-breakpoint
CREATE TABLE `__new_skills` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`documentId` text NOT NULL,
	`name` text,
	`rating` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`documentId`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_skills`("id", "createdAt", "updatedAt", "documentId", "name", "rating") SELECT "id", "createdAt", "updatedAt", "documentId", "name", "rating" FROM `skills`;--> statement-breakpoint
DROP TABLE `skills`;--> statement-breakpoint
ALTER TABLE `__new_skills` RENAME TO `skills`;