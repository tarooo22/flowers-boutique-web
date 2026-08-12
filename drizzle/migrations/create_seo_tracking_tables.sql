-- SEO monitoring persistence
-- Additive only: creates empty tracking tables and never reads, updates, or deletes customer/order data.

CREATE TABLE IF NOT EXISTS `seoKeywords` (
  `id` int NOT NULL AUTO_INCREMENT,
  `keyword` varchar(255) NOT NULL,
  `targetUrl` varchar(512) NULL,
  `isActive` boolean DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `seoKeywords_keyword_unique` (`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `keywordRankings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `keywordId` int NOT NULL,
  `rank` int NULL,
  `searchVolume` int NULL,
  `difficulty` int NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `seoMonitoringTasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taskName` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `lastRun` timestamp NULL,
  `nextRun` timestamp NULL,
  `lastRunAt` timestamp NULL,
  `nextRunAt` timestamp NULL,
  `isEnabled` boolean DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
