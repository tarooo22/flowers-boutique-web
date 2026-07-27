CREATE TABLE `banners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleKa` varchar(255),
	`titleEn` varchar(255),
	`descriptionKa` text,
	`descriptionEn` text,
	`imageUrl` varchar(512) NOT NULL,
	`imageKey` varchar(512) NOT NULL,
	`ctaText` varchar(255),
	`ctaLink` varchar(512),
	`sortOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `banners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameKa` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`descriptionKa` text,
	`descriptionEn` text,
	`slug` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
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
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`customerPhone` varchar(20),
	`items` json NOT NULL,
	`totalPrice` decimal(10,2) NOT NULL,
	`notes` text,
	`orderChannel` enum('whatsapp','messenger','phone','email') DEFAULT 'whatsapp',
	`status` enum('pending','confirmed','preparing','delivered','cancelled') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
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
CREATE TABLE `productImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`imageUrl` varchar(512) NOT NULL,
	`imageKey` varchar(512) NOT NULL,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameKa` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`descriptionKa` text,
	`descriptionEn` text,
	`priceMin` decimal(10,2),
	`priceMax` decimal(10,2),
	`priceOnRequest` boolean DEFAULT false,
	`unitType` varchar(50) DEFAULT 'single stem',
	`categoryId` int NOT NULL,
	`imageUrl` varchar(512),
	`imageKey` varchar(512),
	`isRose` boolean DEFAULT false,
	`isAvailable` boolean DEFAULT true,
	`featured` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64),
	`name` text,
	`email` varchar(320),
	`phone` varchar(20),
	`passwordHash` varchar(255),
	`loginMethod` varchar(64),
	`role` enum('customer','admin') NOT NULL DEFAULT 'customer',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
