CREATE TABLE `document` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`summary` text,
	`theme_color` text DEFAULT '#7c3aed' NOT NULL,
	`thumbnail` text,
	`current_position` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`author_name` text NOT NULL,
	`author_email` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	`document_id` text NOT NULL,
	`university_name` text,
	`degree` text,
	`major` text,
	`description` text,
	`start_date` integer,
	`end_date` integer,
	FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `experience` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	`document_id` text NOT NULL,
	`title` text,
	`company_name` text,
	`state` text,
	`city` text,
	`is_currently_employed` integer,
	`work_summary` text,
	`start_date` integer,
	`end_date` integer,
	FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `personal_info` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	`document_id` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`job_title` text,
	`city` text,
	`address` text,
	`phone` text,
	`email` text,
	FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	`documentId` text NOT NULL,
	`name` text,
	`rating` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`documentId`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
