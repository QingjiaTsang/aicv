DROP INDEX `user_author_name_idx`;--> statement-breakpoint
DROP INDEX `user_author_email_idx`;--> statement-breakpoint
ALTER TABLE `document` DROP COLUMN `author_name`;--> statement-breakpoint
ALTER TABLE `document` DROP COLUMN `author_email`;--> statement-breakpoint
CREATE UNIQUE INDEX `personal_info_document_id_unique` ON `personal_info` (`document_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `document_id_unique_idx` ON `personal_info` (`document_id`);