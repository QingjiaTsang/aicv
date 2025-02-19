DROP INDEX `user_id_idx`;--> statement-breakpoint
DROP INDEX `user_created_at_idx`;--> statement-breakpoint
DROP INDEX `user_title_idx`;--> statement-breakpoint
CREATE INDEX `user_title_summary_idx` ON `document` (`user_id`,`title`,`summary`);