import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '@/user/schemas/user.schema';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(input: LoginInput) {
    const user = await this.userModel.findOne({ email: input.email });

    if (!user) {
      return {
        success: false,
        message: 'Tài khoản không tồn tại',
      };
    }

    const isMatch = await bcrypt.compare(input.password, user.password);

    if (!isMatch) {
      return {
        success: false,
        message: 'Mật khẩu không hợp lệ',
      };
    }

    const { accessToken, refreshToken } = await this.signTokens(user);

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: hashedRefresh,
    });

    return {
      success: true,
      message: 'Success',
      accessToken,
      refreshToken,
      user,
    };
  }

  async signTokens(user: UserDocument) {
    const payload = {
      sub: user._id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userModel.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException();
      }

      return this.jwtService.sign(
        { sub: user.id, email: user.email },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      );
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
