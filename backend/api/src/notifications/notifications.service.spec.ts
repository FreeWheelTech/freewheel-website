import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: PrismaService,
          useValue: {
            notification: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should fetch user notifications', async () => {
    jest
      .spyOn(prisma.notification, 'findMany')
      .mockResolvedValue([{ id: 'notif1' }] as any);
    const res = await service.getUserNotifications('user1');
    expect(res.length).toBe(1);
    expect(prisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user1' } }),
    );
  });

  it('should mark notification as read for the correct user', async () => {
    jest
      .spyOn(prisma.notification, 'findFirst')
      .mockResolvedValue({ id: 'notif1', userId: 'user1' } as any);
    jest
      .spyOn(prisma.notification, 'update')
      .mockResolvedValue({ id: 'notif1', isRead: true } as any);

    const res = await service.markAsRead('user1', 'notif1');
    expect(res.isRead).toBe(true);
  });

  it('should throw NotFoundException if marking another users notification as read (IDOR protection)', async () => {
    // Prisma returns null because the query includes `userId: 'user1'` but the notification belongs to someone else
    jest.spyOn(prisma.notification, 'findFirst').mockResolvedValue(null);

    await expect(service.markAsRead('user1', 'notif2')).rejects.toThrow(
      'Notification not found',
    );
  });

  it('should mark all unread notifications as read', async () => {
    jest
      .spyOn(prisma.notification, 'updateMany')
      .mockResolvedValue({ count: 5 });

    await service.markAllAsRead('user1');
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user1', isRead: false },
      data: { isRead: true },
    });
  });
});
