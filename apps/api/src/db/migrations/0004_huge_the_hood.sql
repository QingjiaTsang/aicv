DROP INDEX `title_idx`;--> statement-breakpoint
DROP INDEX `author_name_idx`;--> statement-breakpoint
DROP INDEX `author_email_idx`;--> statement-breakpoint
DROP INDEX `created_at_idx`;--> statement-breakpoint
DROP INDEX `updated_at_idx`;--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `document` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_created_at_idx` ON `document` (`user_id`,`createdAt`);--> statement-breakpoint
CREATE INDEX `user_updated_at_idx` ON `document` (`user_id`,`updatedAt`);--> statement-breakpoint
CREATE INDEX `user_title_idx` ON `document` (`user_id`,`title`);--> statement-breakpoint
CREATE INDEX `user_author_name_idx` ON `document` (`user_id`,`author_name`);--> statement-breakpoint
CREATE INDEX `user_author_email_idx` ON `document` (`user_id`,`author_email`);