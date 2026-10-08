import type { NotificationType, Prisma } from '@prisma/client';

interface AdminNotificationInput {
  eventKey: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
}

export async function createAdminNotification(
  transaction: Prisma.TransactionClient,
  notification: AdminNotificationInput
) {
  await transaction.notification.upsert({
    where: { eventKey: notification.eventKey },
    update: {},
    create: notification,
  });
}
