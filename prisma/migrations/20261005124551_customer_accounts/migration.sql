-- AlterTable
ALTER TABLE `contactmessage` ADD COLUMN `userId` VARCHAR(30) NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `userId` VARCHAR(30) NULL;

-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `userId` VARCHAR(30) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `name` VARCHAR(120) NULL,
    ADD COLUMN `phone` VARCHAR(30) NULL,
    MODIFY `role` ENUM('ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER';

-- CreateIndex
CREATE INDEX `ContactMessage_userId_createdAt_idx` ON `ContactMessage`(`userId`, `createdAt`);

-- CreateIndex
CREATE INDEX `Order_userId_createdAt_idx` ON `Order`(`userId`, `createdAt`);

-- CreateIndex
CREATE INDEX `Reservation_userId_date_idx` ON `Reservation`(`userId`, `date`);

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactMessage` ADD CONSTRAINT `ContactMessage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
