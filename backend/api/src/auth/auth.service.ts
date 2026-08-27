import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    console.log(`[BACKEND] REGISTER REQUEST RECEIVED - ${Date.now()}`);
    const reqStart = Date.now();
    
    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltOrRounds);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...dataToSave } = registerDto;

    console.log(`[BACKEND] VALIDATION COMPLETE & HASH DONE - elapsed: ${Date.now() - reqStart}ms`);
    console.log(`[BACKEND] DATABASE OPERATION START - ${Date.now()}`);
    const dbStart = Date.now();
    const user = await this.usersService.create({
      ...dataToSave,
      passwordHash,
    });
    console.log(`[BACKEND] DATABASE OPERATION COMPLETE - elapsed: ${Date.now() - dbStart}ms`);

    const result = await this.generateTokens(user.id, user.email, user.role);
    console.log(`[BACKEND] RESPONSE SENT - total elapsed: ${Date.now() - reqStart}ms`);
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  private async generateTokens(userId: string, email: string, role: Role) {
    const payload = { sub: userId, email, role };
    const accessToken = this.jwtService.sign(payload);

    // Refresh token lives for 7 days
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save refresh token to db
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt,
      },
    });

    return {
      user: {
        id: userId,
        email,
        role,
        name: email, // This is just a placeholder, ideally fetch from user
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload: { sub: string; email: string; role: Role } =
        this.jwtService.verify(token);
      const savedToken = await this.prisma.refreshToken.findUnique({
        where: { token },
      });

      if (
        !savedToken ||
        savedToken.revoked ||
        savedToken.expiresAt < new Date()
      ) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Revoke old token
      await this.prisma.refreshToken.update({
        where: { id: savedToken.id },
        data: { revoked: true },
      });

      return this.generateTokens(payload.sub, payload.email, payload.role);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(token: string) {
    try {
      const savedToken = await this.prisma.refreshToken.findUnique({
        where: { token },
      });

      if (savedToken) {
        await this.prisma.refreshToken.update({
          where: { id: savedToken.id },
          data: { revoked: true },
        });
      }
    } catch {
      // Ignore errors on logout
    }
    return { message: 'Logged out successfully' };
  }
}
