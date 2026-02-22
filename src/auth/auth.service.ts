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
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(input: LoginInput) {
    const user = await this.userModel
      .findOne({ email: input.email })
      .select('+password');

    if (!user) {
      return { success: false, message: 'Tài khoản không tồn tại' };
    }

    const isMatch = await bcrypt.compare(input.password, user.password);

    if (!isMatch) {
      return { success: false, message: 'Mật khẩu không hợp lệ' };
    }

    const { accessToken, refreshToken } = await this.signTokens(user);

    // Hash refreshToken trước khi lưu DB (đúng cách)
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken: hashedRefresh,
    });

    return {
      success: true,
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
      user,
    };
  }
  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
  }

  async signTokens(user: UserDocument) {
    const payload = {
      sub: user._id.toString(), // toString() để tránh ObjectId object
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
    // console.log('Verify refresh token:', refreshToken);

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      // console.log('Payload verify thành công:', payload);

      const user = await this.userModel
        .findById(payload.sub)
        .select('+refreshToken');

      if (!user || !user.refreshToken) {
        console.log('User không tồn tại hoặc không có refreshToken trong DB');
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      console.log('Refresh token match DB hash?', isMatch);

      if (!isMatch) {
        console.log('Hash không khớp');
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.jwtService.sign(
        { sub: user._id.toString(), email: user.email },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
      );
    } catch (err: any) {
      console.log('Verify error:', err.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
