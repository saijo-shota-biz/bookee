DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`password` text,
	`provider` text DEFAULT 'Credentials' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
