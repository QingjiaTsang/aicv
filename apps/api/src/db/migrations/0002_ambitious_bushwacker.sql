PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_document` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`summary` text,
	`theme_color` text DEFAULT '#7c3aed' NOT NULL,
	`thumbnail` text,
	`current_position` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'private' NOT NULL,
	`author_name` text NOT NULL,
	`author_email` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_document`("id", "createdAt", "updatedAt", "user_id", "title", "summary", "theme_color", "thumbnail", "current_position", "status", "author_name", "author_email") SELECT "id", "createdAt", "updatedAt", "user_id", "title", "summary", "theme_color", "thumbnail", "current_position", "status", "author_name", "author_email" FROM `document`;--> statement-breakpoint
DROP TABLE `document`;--> statement-breakpoint
ALTER TABLE `__new_document` RENAME TO `document`;--> statement-breakpoint
PRAGMA foreign_keys=ON;