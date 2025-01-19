PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_personal_info` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
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
INSERT INTO `__new_personal_info`("id", "createdAt", "updatedAt", "document_id", "first_name", "last_name", "job_title", "state", "city", "phone", "email") SELECT "id", "createdAt", "updatedAt", "document_id", "first_name", "last_name", "job_title", "state", "city", "phone", "email" FROM `personal_info`;--> statement-breakpoint
DROP TABLE `personal_info`;--> statement-breakpoint
ALTER TABLE `__new_personal_info` RENAME TO `personal_info`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `phone_idx` ON `personal_info` (`phone`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `personal_info` (`email`);