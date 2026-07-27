CREATE TABLE `customerAddresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`label` varchar(50),
	`recipientName` varchar(255) NOT NULL,
	`recipientPhone` varchar(20) NOT NULL,
	`address` text NOT NULL,
	`city` varchar(100) NOT NULL,
	`postalCode` varchar(20),
	`isDefault` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customerAddresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customerOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`items` json NOT NULL,
	`totalPrice` decimal(10,2) NOT NULL,
	`recipientName` varchar(255) NOT NULL,
	`recipientPhone` varchar(20) NOT NULL,
	`deliveryAddress` text NOT NULL,
	`deliveryDate` varchar(20) NOT NULL,
	`deliveryTime` varchar(20),
	`giftMessage` text,
	`paymentMethod` enum('cash','card','bank_transfer','whatsapp') DEFAULT 'cash',
	`status` enum('pending','confirmed','preparing','delivered','cancelled') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customerOrders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `passwordResetTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `passwordResetTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `passwordResetTokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `openId` varchar(64);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('customer','admin') NOT NULL DEFAULT 'customer';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);