ALTER TABLE `registration` ADD `checked_in_by` text REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `user` ADD `attendance_count` integer DEFAULT 0 NOT NULL;