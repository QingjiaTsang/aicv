PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_education` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`document_id` text NOT NULL,
	`university_name` text(255),
	`degree` text(255),
	`major` text(255),
	`description` text(10000),
	`start_date` integer,
	`end_date` integer,
	FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_education`("id", "createdAt", "updatedAt", "document_id", "university_name", "degree", "major", "description", "start_date", "end_date") SELECT "id", "createdAt", "updatedAt", "document_id", "university_name", "degree", "major", "description", "start_date", "end_date" FROM `education`;--> statement-breakpoint
DROP TABLE `education`;--> statement-breakpoint
ALTER TABLE `__new_education` RENAME TO `education`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
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
	`work_summary` text(10000),
	`start_date` integer,
	`end_date` integer,
	FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_experience`("id", "createdAt", "updatedAt", "document_id", "title", "company_name", "state", "city", "is_currently_employed", "work_summary", "start_date", "end_date") SELECT "id", "createdAt", "updatedAt", "document_id", "title", "company_name", "state", "city", "is_currently_employed", "work_summary", "start_date", "end_date" FROM `experience`;--> statement-breakpoint
DROP TABLE `experience`;--> statement-breakpoint
ALTER TABLE `__new_experience` RENAME TO `experience`;