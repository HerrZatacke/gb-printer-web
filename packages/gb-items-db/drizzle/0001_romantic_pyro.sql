CREATE TABLE `binary_frames` (
	`hash` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `binary_images` (
	`hash` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `frames` (
	`id` text PRIMARY KEY NOT NULL,
	`hash` text NOT NULL,
	`name` text NOT NULL,
	`lines` integer DEFAULT 360 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `frame_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `palettes` (
	`short_name` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`palette` text NOT NULL,
	`origin` text DEFAULT '' NOT NULL,
	`is_predefined` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `plugins` (
	`url` text PRIMARY KEY NOT NULL,
	`config` text,
	`name` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`config_params` text
);
