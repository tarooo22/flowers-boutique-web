ALTER TABLE `products` ADD `bloomsPerStemMin` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `products` ADD `bloomsPerStemMax` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `products` ADD `stemDisplayRule` varchar(255);