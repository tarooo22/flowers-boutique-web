CREATE TABLE `authSessions` (
	`tokenHash` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`revokedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastUsedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `authSessions_tokenHash` PRIMARY KEY(`tokenHash`)
);
--> statement-breakpoint
CREATE INDEX `authSessions_userId_idx` ON `authSessions` (`userId`);--> statement-breakpoint
CREATE INDEX `authSessions_expiresAt_idx` ON `authSessions` (`expiresAt`);