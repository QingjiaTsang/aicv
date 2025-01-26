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
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_document`("id", "user_id", "title", "summary", "theme_color", "thumbnail", "current_position", "status", "section_order", "createdAt", "updatedAt") SELECT "id", "user_id", "title", "summary", "theme_color", "thumbnail", "current_position", "status", "section_order", "createdAt", "updatedAt" FROM `document`;--> statement-breakpoint
DROP TABLE `document`;--> statement-breakpoint
ALTER TABLE `__new_document` RENAME TO `document`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `document` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_created_at_idx` ON `document` (`user_id`,`createdAt`);--> statement-breakpoint
CREATE INDEX `user_updated_at_idx` ON `document` (`user_id`,`updatedAt`);--> statement-breakpoint
CREATE INDEX `user_status_idx` ON `document` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `user_title_idx` ON `document` (`user_id`,`title`);