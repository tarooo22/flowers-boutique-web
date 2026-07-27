-- Add Meta Purchase event tracking columns for idempotency and deduplication
ALTER TABLE `orders` ADD COLUMN `metaPurchaseEventId` varchar(100);
ALTER TABLE `orders` ADD COLUMN `metaPurchaseSentAt` timestamp;
