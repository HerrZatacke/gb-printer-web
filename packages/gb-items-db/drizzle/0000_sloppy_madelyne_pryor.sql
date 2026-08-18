CREATE TABLE `image_references` (
	`source_hash` text NOT NULL,
	`referenced_hash` text NOT NULL,
	PRIMARY KEY(`source_hash`, `referenced_hash`),
	FOREIGN KEY (`source_hash`) REFERENCES `images`(`hash`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_image_references_referenced_hash` ON `image_references` (`referenced_hash`);--> statement-breakpoint
CREATE TABLE `image_tags` (
	`image_hash` text NOT NULL,
	`tag` text NOT NULL,
	PRIMARY KEY(`image_hash`, `tag`),
	FOREIGN KEY (`image_hash`) REFERENCES `images`(`hash`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_image_tags_tag` ON `image_tags` (`tag`);--> statement-breakpoint
CREATE TABLE `images` (
	`hash` text PRIMARY KEY NOT NULL,
	`created` text,
	`title` text,
	`frame` text,
	`tags` text DEFAULT '[]',
	`lock_frame` integer,
	`rotation` integer,
	`meta` text,
	`type` text NOT NULL,
	`palette` text,
	`lines` integer,
	`invert_palette` integer,
	`frame_palette` text,
	`invert_frame_palette` integer,
	`hashes` text,
	`referenced_hashes` text DEFAULT '[]',
	`special_tags` text DEFAULT '[]'
);
--> statement-breakpoint
CREATE TABLE `image_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`created` text,
	`title` text,
	`is_favourite` integer,
	`cover_image` text,
	`images` text DEFAULT '[]',
	`groups` text DEFAULT '[]',
	`tags` text DEFAULT '[]',
	`special_tags` text DEFAULT '[]',
	`palettes` text DEFAULT '[]',
	`frames` text DEFAULT '[]'
);
