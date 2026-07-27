-- Create orderSourceMappings table for migration tracking
-- Maps legacy customerOrders rows to canonical orders rows
-- Ensures idempotent migration and prevents duplicates

CREATE TABLE IF NOT EXISTS `orderSourceMappings` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `sourceTable` varchar(50) NOT NULL COMMENT 'Source table name (e.g., "customerOrders")',
  `sourceOrderId` int NOT NULL COMMENT 'Legacy order ID from source table',
  `canonicalOrderId` int NOT NULL COMMENT 'New canonical orders.id',
  `canonicalOrderNumber` int NOT NULL COMMENT 'New orders.orderNumber',
  `migratedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint: prevent migrating same source order twice
  UNIQUE KEY `sourceUnique` (`sourceTable`, `sourceOrderId`),
  
  -- Index for lookups by canonical ID
  KEY `canonicalOrderIdIdx` (`canonicalOrderId`),
  KEY `canonicalOrderNumberIdx` (`canonicalOrderNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
