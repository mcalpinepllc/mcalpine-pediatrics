CREATE TABLE `portalAuditEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorUserId` int NOT NULL,
	`documentId` int,
	`action` enum('document_uploaded','document_downloaded','document_archived','telehealth_launched') NOT NULL,
	`detail` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portalAuditEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portalDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientUserId` int NOT NULL,
	`uploadedByUserId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`mimeType` varchar(128) NOT NULL,
	`fileSize` int NOT NULL,
	`category` enum('visit_summary','form','record','other') NOT NULL DEFAULT 'other',
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`archivedAt` timestamp,
	CONSTRAINT `portalDocuments_id` PRIMARY KEY(`id`),
	CONSTRAINT `portalDocuments_fileKey_unique` UNIQUE(`fileKey`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `portalAuditEvents` ADD CONSTRAINT `portalAuditEvents_actorUserId_users_id_fk` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `portalAuditEvents` ADD CONSTRAINT `portalAuditEvents_documentId_portalDocuments_id_fk` FOREIGN KEY (`documentId`) REFERENCES `portalDocuments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `portalDocuments` ADD CONSTRAINT `portalDocuments_patientUserId_users_id_fk` FOREIGN KEY (`patientUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `portalDocuments` ADD CONSTRAINT `portalDocuments_uploadedByUserId_users_id_fk` FOREIGN KEY (`uploadedByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `portalAuditEvents_actor_created_idx` ON `portalAuditEvents` (`actorUserId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `portalAuditEvents_document_created_idx` ON `portalAuditEvents` (`documentId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `portalDocuments_patient_created_idx` ON `portalDocuments` (`patientUserId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `portalDocuments_uploader_created_idx` ON `portalDocuments` (`uploadedByUserId`,`createdAt`);