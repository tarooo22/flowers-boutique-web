ALTER TABLE `products` ADD `priceMin` decimal(10,2);--> statement-breakpoint
ALTER TABLE `products` ADD `priceMax` decimal(10,2);--> statement-breakpoint
ALTER TABLE `products` ADD `priceOnRequest` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `products` ADD `unitType` varchar(50) DEFAULT 'single stem';--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `price`;