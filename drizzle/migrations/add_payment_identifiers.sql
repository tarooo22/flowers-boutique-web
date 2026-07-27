-- Add payment identifier fields to orders table
ALTER TABLE `orders` ADD COLUMN `orderNumber` INT UNIQUE COMMENT 'Sequential order number (600001, 600002, etc.)';
ALTER TABLE `orders` ADD COLUMN `bogExternalOrderId` VARCHAR(25) COMMENT 'FLR-600001 format';
ALTER TABLE `orders` ADD COLUMN `bogAuthCode` VARCHAR(50) COMMENT 'Authorization code from BOG';
ALTER TABLE `orders` ADD COLUMN `bogPayerIdentifier` VARCHAR(255) COMMENT 'Masked payer identifier';
ALTER TABLE `orders` ADD COLUMN `bogPaymentMethod` VARCHAR(50) COMMENT 'card, apple_pay, google_pay, etc.';
ALTER TABLE `orders` ADD COLUMN `paidAt` TIMESTAMP NULL COMMENT 'When payment was completed';
ALTER TABLE `orders` ADD COLUMN `paymentLastCheckedAt` TIMESTAMP NULL COMMENT 'Last reconciliation with BOG';
ALTER TABLE `orders` ADD COLUMN `paymentFailureReason` TEXT COMMENT 'Why payment failed';

-- Create index for order number lookup
CREATE UNIQUE INDEX `idx_orderNumber` ON `orders` (`orderNumber`);

-- Create index for BOG external order ID lookup
CREATE INDEX `idx_bogExternalOrderId` ON `orders` (`bogExternalOrderId`);

-- Create index for BOG order ID lookup
CREATE INDEX `idx_bogOrderId` ON `orders` (`bogOrderId`);
