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
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`customerPhone` varchar(20),
	`items` json NOT NULL,
	`totalPrice` decimal(10,2) NOT NULL,
	`notes` text,
	`orderChannel` enum('whatsapp','messenger','phone','email') DEFAULT 'whatsapp',
	`status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
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
	`price` decimal(10,2) NOT NULL,
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
