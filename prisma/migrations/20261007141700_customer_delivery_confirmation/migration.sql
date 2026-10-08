ALTER TABLE `Order`
  MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERY_ISSUE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  ADD COLUMN `deliveryConfirmedAt` DATETIME(3) NULL,
  ADD COLUMN `deliveryIssueReportedAt` DATETIME(3) NULL,
  ADD COLUMN `deliveryIssueResolvedAt` DATETIME(3) NULL;

ALTER TABLE `Review`
  DROP INDEX `Review_orderId_idx`,
  ADD UNIQUE INDEX `Review_orderId_key` (`orderId`);

ALTER TABLE `BusinessSettings`
  MODIFY `locationLabel` VARCHAR(255) NOT NULL DEFAULT 'Lakeside, Pokhara, Nepal';

UPDATE `BusinessSettings`
SET `locationLabel` = 'Lakeside, Pokhara, Nepal'
WHERE `id` = 'default'
  AND `locationLabel` = 'Lakeside, Pokhara, Nepal (demo area)';

UPDATE `GalleryImage`
SET `visible` = false
WHERE `id` = 'demo-lakeside-cafe'
  AND `title` = 'Lakeside café atmosphere concept';
