ALTER TABLE `Order`
    ADD COLUMN `completedAt` DATETIME(3) NULL;

UPDATE `Order`
SET `completedAt` = `updatedAt`
WHERE `status` = 'COMPLETED';

CREATE INDEX `Order_status_completedAt_idx` ON `Order`(`status`, `completedAt`);

CREATE TABLE `Notification` (
    `id` VARCHAR(30) NOT NULL,
    `eventKey` VARCHAR(100) NOT NULL,
    `type` ENUM('NEW_ORDER', 'NEW_RESERVATION', 'NEW_REVIEW', 'NEW_CONTACT_MESSAGE', 'DELIVERY_ISSUE') NOT NULL,
    `title` VARCHAR(120) NOT NULL,
    `message` TEXT NOT NULL,
    `link` VARCHAR(512) NOT NULL,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Notification_eventKey_key`(`eventKey`),
    INDEX `Notification_readAt_createdAt_idx`(`readAt`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
