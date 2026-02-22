import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from '@/auth/models/authPayload';
import { RefreshPayload } from '@/auth/models/refresh-payload.model';
import { GqlAuthGuard } from '@/auth/gql-auth.guard';
import { Inject, UseGuards } from '@nestjs/common';
import { LogoutResponse } from './models/logout.reponsive';
import type { GqlContext } from '@/common/gql-context';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(
    @Args('input') input: LoginInput,
    @Context() context: GqlContext,
  ) {
    const { accessToken, refreshToken, user, success, message } =
      await this.authService.login(input);

    context.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      success,
      message,
      accessToken,
      user,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => LogoutResponse)
  async logout(@Context() { req, res }: GqlContext) {
    const userId = req.user.userId;

    // 1. Xoá refresh token trong DB
    await this.authService.logout(userId);

    // 2. Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { success: true, message: 'Đăng xuất thành công' };
  }
  @Mutation(() => RefreshPayload)
  async refreshToken(@Context() context: GqlContext) {
    const refreshToken = context.req.cookies?.refreshToken;

    // console.log('Refresh token nhận được:', refreshToken);
    // console.log('User từ guard:', context.req.user);

    if (!refreshToken) {
      return { success: false, message: 'Không tìm thấy refresh token' };
    }

    const accessToken = await this.authService.refreshAccessToken(refreshToken);

    return { accessToken };
  }
}
