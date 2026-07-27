CREATE TABLE `keywordRankings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`keywordId` int NOT NULL,
	`position` int,
	`impressions` int DEFAULT 0,
	`clicks` int DEFAULT 0,
	`ctr` decimal(5,2) DEFAULT '0',
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `keywordRankings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seoKeywords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`keyword` varchar(255) NOT NULL,
	`keywordKa` varchar(255) NOT NULL,
	`landingPageUrl` varchar(512) NOT NULL,
	`targetPosition` int DEFAULT 10,
	`priority` enum('high','medium','low') DEFAULT 'medium',
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seoKeywords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seoMonitoringTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`scheduleCronTaskUid` varchar(65),
	`frequency` enum('daily','weekly','monthly') DEFAULT 'weekly',
	`lastRunAt` timestamp,
	`nextRunAt` timestamp,
	`isEnabled` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seoMonitoringTasks_id` PRIMARY KEY(`id`),
	CONSTRAINT `seoMonitoringTasks_scheduleCronTaskUid_unique` UNIQUE(`scheduleCronTaskUid`)
);
--> statement-breakpoint
ALTER TABLE `keywordRankings` ADD CONSTRAINT `keywordRankings_keywordId_seoKeywords_id_fk` FOREIGN KEY (`keywordId`) REFERENCES `seoKeywords`(`id`) ON DELETE no action ON UPDATE no action;