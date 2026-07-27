ALTER TABLE `orders` ADD `deletedAt` timestamp;--> statement-breakpoint
ALTER TABLE `orders` ADD `deletedByUserId` int;--> statement-breakpoint
ALTER TABLE `orders` ADD `deletionReason` text;
