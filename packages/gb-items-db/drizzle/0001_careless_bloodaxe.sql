ALTER TABLE `binary_frames` ADD `owner` text DEFAULT 'anonymous' NOT NULL;--> statement-breakpoint
ALTER TABLE `binary_images` ADD `owner` text DEFAULT 'anonymous' NOT NULL;--> statement-breakpoint
ALTER TABLE `frames` ADD `owner` text DEFAULT 'anonymous' NOT NULL;--> statement-breakpoint
ALTER TABLE `frame_groups` ADD `owner` text DEFAULT 'anonymous' NOT NULL;--> statement-breakpoint
ALTER TABLE `image_references` ADD `owner` text DEFAULT 'anonymous' NOT NULL;--> statement-breakpoint
ALTER TABLE `image_tags` ADD `owner` text DEFAULT 'anonymous' NOT NULL;--> statement-breakpoint
ALTER TABLE `images` ADD `owner` text DEFAULT 'anonymous' NOT NULL;--> statement-breakpoint
ALTER TABLE `image_groups` ADD `owner` text DEFAULT 'anonymous' NOT NULL;--> statement-breakpoint
ALTER TABLE `palettes` ADD `owner` text DEFAULT 'anonymous' NOT NULL;--> statement-breakpoint
ALTER TABLE `plugins` ADD `owner` text DEFAULT 'anonymous' NOT NULL;