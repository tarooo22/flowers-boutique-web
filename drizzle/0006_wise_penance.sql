ALTER TABLE `customerOrders` ADD `additionalComment` text;--> statement-breakpoint
ALTER TABLE `customerOrders` ADD `paymentStatus` enum('pending_payment','paid','failed','cancelled','refunded') DEFAULT 'pending_payment';--> statement-breakpoint
ALTER TABLE `customerOrders` ADD `deliveryStatus` enum('new','processing','preparing','courier','delivered','cancelled') DEFAULT 'new';--> statement-breakpoint
ALTER TABLE `customerOrders` ADD `bogOrderId` varchar(255);--> statement-breakpoint
ALTER TABLE `customerOrders` ADD `bogTransactionId` varchar(255);--> statement-breakpoint
ALTER TABLE `customerOrders` ADD `bogPaymentStatus` varchar(50);--> statement-breakpoint
ALTER TABLE `customerOrders` ADD `bogCallbackReceived` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `customerOrders` ADD `bogPaymentDate` timestamp;