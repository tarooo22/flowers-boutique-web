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
DROP TABLE `passwordResetTokens`;--> statement-breakpoint
ALTER TABLE `seoMonitoringTasks` DROP INDEX `seoMonitoringTasks_scheduleCronTaskUid_unique`;--> statement-breakpoint
ALTER TABLE `keywordRankings` DROP FOREIGN KEY `keywordRankings_keywordId_seoKeywords_id_fk`;
--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `orderChannel` enum('whatsapp','messenger','phone','email','card') DEFAULT 'whatsapp';--> statement-breakpoint
ALTER TABLE `keywordRankings` ADD `rank` int;--> statement-breakpoint
ALTER TABLE `keywordRankings` ADD `searchVolume` int;--> statement-breakpoint
ALTER TABLE `keywordRankings` ADD `difficulty` int;--> statement-breakpoint
ALTER TABLE `orders` ADD `userId` int;--> statement-breakpoint
ALTER TABLE `orders` ADD `recipientName` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `recipientPhone` varchar(20);--> statement-breakpoint
ALTER TABLE `orders` ADD `deliveryAddress` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `latitude` decimal(10,6);--> statement-breakpoint
ALTER TABLE `orders` ADD `longitude` decimal(10,6);--> statement-breakpoint
ALTER TABLE `orders` ADD `placeId` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `building` varchar(50);--> statement-breakpoint
ALTER TABLE `orders` ADD `entrance` varchar(50);--> statement-breakpoint
ALTER TABLE `orders` ADD `floor` varchar(50);--> statement-breakpoint
ALTER TABLE `orders` ADD `apartment` varchar(50);--> statement-breakpoint
ALTER TABLE `orders` ADD `deliveryDate` varchar(20);--> statement-breakpoint
ALTER TABLE `orders` ADD `deliveryTime` varchar(20);--> statement-breakpoint
ALTER TABLE `orders` ADD `giftMessage` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `courierNotes` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentMethod` enum('cash','card','bank_transfer','whatsapp','messenger') DEFAULT 'cash';--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentStatus` enum('pending','paid','failed','cancelled','refunded') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `orders` ADD `deliveryStatus` enum('new','awaiting_confirmation','processing','preparing','courier','delivered','cancelled') DEFAULT 'new';--> statement-breakpoint
ALTER TABLE `orders` ADD `orderNumber` int;--> statement-breakpoint
ALTER TABLE `orders` ADD `fulfillmentType` enum('delivery','pickup') DEFAULT 'delivery';--> statement-breakpoint
ALTER TABLE `orders` ADD `deliveryFee` decimal(10,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `orders` ADD `bogOrderId` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `bogExternalOrderId` varchar(25);--> statement-breakpoint
ALTER TABLE `orders` ADD `bogTransactionId` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `bogAuthCode` varchar(50);--> statement-breakpoint
ALTER TABLE `orders` ADD `bogPayerIdentifier` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `bogPaymentMethod` varchar(50);--> statement-breakpoint
ALTER TABLE `orders` ADD `bogPaymentStatus` varchar(50);--> statement-breakpoint
ALTER TABLE `orders` ADD `bogCallbackReceived` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `orders` ADD `paidAt` timestamp;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentLastCheckedAt` timestamp;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentFailureReason` text;--> statement-breakpoint
ALTER TABLE `seoKeywords` ADD `targetUrl` varchar(512);--> statement-breakpoint
ALTER TABLE `seoMonitoringTasks` ADD `taskName` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `seoMonitoringTasks` ADD `status` varchar(50) DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `seoMonitoringTasks` ADD `lastRun` timestamp;--> statement-breakpoint
ALTER TABLE `seoMonitoringTasks` ADD `nextRun` timestamp;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`);--> statement-breakpoint
ALTER TABLE `seoKeywords` ADD CONSTRAINT `seoKeywords_keyword_unique` UNIQUE(`keyword`);--> statement-breakpoint
ALTER TABLE `keywordRankings` DROP COLUMN `position`;--> statement-breakpoint
ALTER TABLE `keywordRankings` DROP COLUMN `impressions`;--> statement-breakpoint
ALTER TABLE `keywordRankings` DROP COLUMN `clicks`;--> statement-breakpoint
ALTER TABLE `keywordRankings` DROP COLUMN `ctr`;--> statement-breakpoint
ALTER TABLE `keywordRankings` DROP COLUMN `recordedAt`;--> statement-breakpoint
ALTER TABLE `seoKeywords` DROP COLUMN `keywordKa`;--> statement-breakpoint
ALTER TABLE `seoKeywords` DROP COLUMN `landingPageUrl`;--> statement-breakpoint
ALTER TABLE `seoKeywords` DROP COLUMN `targetPosition`;--> statement-breakpoint
ALTER TABLE `seoKeywords` DROP COLUMN `priority`;--> statement-breakpoint
ALTER TABLE `seoKeywords` DROP COLUMN `isActive`;--> statement-breakpoint
ALTER TABLE `seoMonitoringTasks` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `seoMonitoringTasks` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `seoMonitoringTasks` DROP COLUMN `scheduleCronTaskUid`;--> statement-breakpoint
ALTER TABLE `seoMonitoringTasks` DROP COLUMN `frequency`;--> statement-breakpoint
ALTER TABLE `seoMonitoringTasks` DROP COLUMN `lastRunAt`;--> statement-breakpoint
ALTER TABLE `seoMonitoringTasks` DROP COLUMN `nextRunAt`;--> statement-breakpoint
ALTER TABLE `seoMonitoringTasks` DROP COLUMN `isEnabled`;