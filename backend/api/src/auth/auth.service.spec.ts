/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;
  let jwtService: any;

  beforeEach(async () => {
    usersService = { findByEmail: jest.fn(), create: jest.fn() };
    jwtService = { sign: jest.fn(), verify: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        {
          provide: PrismaService,
          useValue: {
            refreshToken: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should hash password and create user on register', async () => {
    const dto = {
      name: 'Test',
      email: 'test@test.com',
      password: 'password',
      role: 'CUSTOMER' as any,
    };
    usersService.create.mockResolvedValue({ id: '1', ...dto });
    jwtService.sign.mockReturnValue('token');

    const result = await service.register(dto);
    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test',
        email: 'test@test.com',
        passwordHash: expect.any(String),
      }),
    );
    expect(result.accessToken).toBe('token');
  });

  it('should fail login with wrong password', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      passwordHash: await bcrypt.hash('correct', 10),
    });
    await expect(
      service.login({ email: 'test@test.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
