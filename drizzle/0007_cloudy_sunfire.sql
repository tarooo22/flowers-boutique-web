ALTER TABLE `customerOrders` ADD `latitude` decimal(10,6);--> statement-breakpoint
ALTER TABLE `customerOrders` ADD `longitude` decimal(10,6);--> statement-breakpoint
ALTER TABLE `customerOrders` ADD `placeId` varchar(255);--> statement-breakpoint
ALTER TABLE `customerOrders` ADD `building` varchar(50);--> statement-breakpoint
ALTER TABLE `customerOrders` ADD `entrance` varchar(50);--> statement-breakpoint
ALTER TABLE `customerOrders` ADD `floor` varchar(50);--> statement-breakpoint
ALTER TABLE `customerOrders` ADD `apartment` varchar(50);