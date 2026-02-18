import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto, LoginDto, SendOTPDto, VerifyOTPDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto, tenantId?: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        password: hashedPassword,
      },
    });

    // If tenantId is provided, assign default role
    if (tenantId) {
      const defaultRole = await this.prisma.role.findFirst({
        where: { name: 'User' },
      });

      if (defaultRole) {
        await this.prisma.userRole.create({
          data: {
            userId: user.id,
            tenantId,
            roleId: defaultRole.id,
          },
        });
      }
    }

    // Send welcome email
    await this.mailService.sendWelcomeEmail(user.email, user.fullName || 'User');

    // Return user info without tokens (OTP will be sent separately)
    return {
      message: 'Registration successful. Please verify your email with OTP.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
            tenant: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    if (!user.password) {
      throw new UnauthorizedException('Password not set for this account');
    }
    
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles.map(ur => ({
          roleId: ur.roleId,
          role: ur.role.name,
          tenant: {
            id: ur.tenant.id,
            name: ur.tenant.name,
          },
          permissions: ur.role.permissions.map(rp => rp.permission.code),
        })),
      },
      ...tokens,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const tokens = await this.generateTokens(payload.sub, payload.email);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // OTP Methods
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTP(dto: SendOTPDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // If password is provided (login flow), verify it
    if (dto.password) {
      if (!user.password) {
        throw new UnauthorizedException('Password not set for this account');
      }
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    // Generate OTP and set expiry (10 minutes from now)
    const otp = this.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiry,
        otpAttempts: 0,
      },
    });

    // Send OTP via email
    await this.mailService.sendOTP(user.email, otp);

    return { message: 'OTP sent successfully to your email' };
  }

  async verifyOTP(dto: VerifyOTPDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
            tenant: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if OTP exists
    if (!user.otp) {
      throw new BadRequestException('No OTP found. Please request a new OTP');
    }

    // Check if OTP is expired
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { otp: null, otpExpiry: null, otpAttempts: 0 },
      });
      throw new BadRequestException('OTP has expired. Please request a new OTP');
    }

    // Check OTP attempts (max 3 attempts)
    if (user.otpAttempts >= 3) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { otp: null, otpExpiry: null, otpAttempts: 0 },
      });
      throw new BadRequestException('Maximum OTP attempts exceeded. Please request a new OTP');
    }

    // Verify OTP
    if (user.otp !== dto.otp) {
      // Increment attempts
      await this.prisma.user.update({
        where: { id: user.id },
        data: { otpAttempts: user.otpAttempts + 1 },
      });
      throw new UnauthorizedException('Invalid OTP');
    }

    // Clear OTP after successful verification
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpiry: null,
        otpAttempts: 0,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles.map(ur => ({
          roleId: ur.roleId,
          role: ur.role.name,
          tenant: {
            id: ur.tenant.id,
            name: ur.tenant.name,
          },
          permissions: ur.role.permissions.map(rp => rp.permission.code),
        })),
      },
      ...tokens,
    };
  }
}
