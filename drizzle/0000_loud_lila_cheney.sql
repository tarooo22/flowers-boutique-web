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
	`latitude` decimal(10,6),
	`longitude` decimal(10,6),
	`placeId` varchar(255),
	`building` varchar(50),
	`entrance` varchar(50),
	`floor` varchar(50),
	`apartment` varchar(50),
	`deliveryDate` varchar(20) NOT NULL,
	`deliveryTime` varchar(20),
	`giftMessage` text,
	`additionalComment` text,
	`paymentMethod` enum('cash','card','bank_transfer','whatsapp') DEFAULT 'cash',
	`paymentStatus` enum('pending_payment','paid','failed','cancelled','refunded') DEFAULT 'pending_payment',
	`deliveryStatus` enum('new','processing','preparing','courier','delivered','cancelled') DEFAULT 'new',
	`bogOrderId` varchar(255),
	`bogTransactionId` varchar(255),
	`bogPaymentStatus` varchar(50),
	`bogCallbackReceived` boolean DEFAULT false,
	`bogPaymentDate` timestamp,
	`status` enum('pending','pending_payment','paid','failed','confirmed','preparing','delivered','cancelled') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customerOrders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `keywordRankings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`keywordId` int NOT NULL,
	`rank` int,
	`searchVolume` int,
	`difficulty` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `keywordRankings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderSourceMappings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceTable` varchar(50) NOT NULL,
	`sourceOrderId` int NOT NULL,
	`canonicalOrderId` int NOT NULL,
	`canonicalOrderNumber` int NOT NULL,
	`migratedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderSourceMappings_id` PRIMARY KEY(`id`),
	CONSTRAINT `sourceUnique` UNIQUE(`sourceTable`,`sourceOrderId`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`customerPhone` varchar(20),
	`items` json NOT NULL,
	`totalPrice` decimal(10,2) NOT NULL,
	`notes` text,
	`recipientName` varchar(255),
	`recipientPhone` varchar(20),
	`deliveryAddress` text,
	`latitude` decimal(10,6),
	`longitude` decimal(10,6),
	`placeId` varchar(255),
	`building` varchar(50),
	`entrance` varchar(50),
	`floor` varchar(50),
	`apartment` varchar(50),
	`deliveryDate` varchar(20),
	`deliveryTime` varchar(20),
	`giftMessage` text,
	`courierNotes` text,
	`orderChannel` enum('whatsapp','messenger','phone','email','card','website') DEFAULT 'whatsapp',
	`paymentMethod` enum('cash','card','bank_transfer','whatsapp','messenger') DEFAULT 'cash',
	`paymentStatus` enum('pending','paid','failed','cancelled','refunded') DEFAULT 'pending',
	`deliveryStatus` enum('new','awaiting_confirmation','processing','preparing','courier','delivered','cancelled') DEFAULT 'new',
	`orderNumber` int,
	`fulfillmentType` enum('delivery','pickup') DEFAULT 'delivery',
	`deliveryFee` decimal(10,2) DEFAULT '0',
	`bogOrderId` varchar(255),
	`bogExternalOrderId` varchar(25),
	`bogTransactionId` varchar(255),
	`bogAuthCode` varchar(50),
	`bogPayerIdentifier` varchar(255),
	`bogPaymentMethod` varchar(50),
	`bogPaymentStatus` varchar(50),
	`bogCallbackReceived` boolean DEFAULT false,
	`paidAt` timestamp,
	`paymentLastCheckedAt` timestamp,
	`paymentFailureReason` text,
	`status` enum('pending','pending_payment','paid','failed','confirmed','preparing','delivered','cancelled') DEFAULT 'pending',
	`metaFbc` varchar(500),
	`metaFbp` varchar(500),
	`deletedAt` timestamp,
	`deletedByUserId` int,
	`deletionReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
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
	`published` boolean DEFAULT true,
	`featured` boolean DEFAULT false,
	`variants` json DEFAULT ('[]'),
	`bloomsPerStemMin` int DEFAULT 1,
	`bloomsPerStemMax` int DEFAULT 1,
	`stemDisplayRule` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seoKeywords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`keyword` varchar(255) NOT NULL,
	`targetUrl` varchar(512),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seoKeywords_id` PRIMARY KEY(`id`),
	CONSTRAINT `seoKeywords_keyword_unique` UNIQUE(`keyword`)
);
--> statement-breakpoint
CREATE TABLE `seoMonitoringTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskName` varchar(255) NOT NULL,
	`status` varchar(50) DEFAULT 'pending',
	`lastRun` timestamp,
	`nextRun` timestamp,
	`lastRunAt` timestamp,
	`nextRunAt` timestamp,
	`isEnabled` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seoMonitoringTasks_id` PRIMARY KEY(`id`)
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
