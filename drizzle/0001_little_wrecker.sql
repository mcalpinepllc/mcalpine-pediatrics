CREATE TABLE `noticeViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`noticeId` int NOT NULL,
	`userId` int NOT NULL,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `noticeViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `practiceNotices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authoredByUserId` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`body` text NOT NULL,
	`priority` enum('routine','important') NOT NULL DEFAULT 'routine',
	`publishedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`archivedAt` timestamp,
	CONSTRAINT `practiceNotices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `portalAuditEvents`;--> statement-breakpoint
DROP TABLE `portalDocuments`;--> statement-breakpoint
ALTER TABLE `noticeViews` ADD CONSTRAINT `noticeViews_noticeId_practiceNotices_id_fk` FOREIGN KEY (`noticeId`) REFERENCES `practiceNotices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `noticeViews` ADD CONSTRAINT `noticeViews_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `practiceNotices` ADD CONSTRAINT `practiceNotices_authoredByUserId_users_id_fk` FOREIGN KEY (`authoredByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `noticeViews_notice_user_idx` ON `noticeViews` (`noticeId`,`userId`);--> statement-breakpoint
CREATE INDEX `noticeViews_user_viewed_idx` ON `noticeViews` (`userId`,`viewedAt`);--> statement-breakpoint
CREATE INDEX `practiceNotices_published_idx` ON `practiceNotices` (`publishedAt`);