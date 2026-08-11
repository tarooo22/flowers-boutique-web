-- Native login session persistence
-- Stores only SHA-256 token hashes; raw browser session tokens are never persisted.

CREATE TABLE IF NOT EXISTS `authSessions` (
  `tokenHash` varchar(64) NOT NULL,
  `userId` int NOT NULL,
  `expiresAt` timestamp NOT NULL,
  `revokedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastUsedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tokenHash`),
  KEY `authSessions_userId_idx` (`userId`),
  KEY `authSessions_expiresAt_idx` (`expiresAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
