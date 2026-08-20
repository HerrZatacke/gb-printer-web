ALTER TABLE `binary_frames` RENAME COLUMN "hash" TO "key";--> statement-breakpoint
ALTER TABLE `binary_frames` RENAME COLUMN "data" TO "value";--> statement-breakpoint
ALTER TABLE `binary_images` RENAME COLUMN "hash" TO "key";--> statement-breakpoint
ALTER TABLE `binary_images` RENAME COLUMN "data" TO "value";