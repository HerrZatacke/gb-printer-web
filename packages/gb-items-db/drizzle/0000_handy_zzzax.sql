CREATE TABLE `image_references` (
	`source_hash` text NOT NULL,
	`referenced_hash` text NOT NULL,
	PRIMARY KEY(`source_hash`, `referenced_hash`),
	FOREIGN KEY (`source_hash`) REFERENCES `images`(`hash`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_image_references_referenced_hash` ON `image_references` (`referenced_hash`);--> statement-breakpoint
CREATE TABLE `images` (
	`hash` text PRIMARY KEY NOT NULL,
	`hashes` text,
	`created` text NOT NULL,
	`title` text NOT NULL,
	`frame` text,
	`tags` text NOT NULL,
	`type` text NOT NULL,
	`lines` integer NOT NULL,
	`palette` text,
	`invert_palette` integer DEFAULT false NOT NULL
);
