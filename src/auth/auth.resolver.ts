import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from '@/auth/models/authPayload';
import {RefreshPayload } from '@/auth/models/refresh-payload.model'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput, @Context() context: any) {
    const { accessToken, refreshToken, user, success, message } =
      await this.authService.login(input);

    context.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      success: success,
      message: message,
      accessToken,
      user,
    };
  }
  @Mutation(() => RefreshPayload)
  async refreshToken(@Context() context: any) {
    const refreshToken = context.req.cookies?.refreshToken;

    if (!refreshToken) {
      return{
        success: false,
        message: "InValid!",
      }
    }

    const accessToken = await this.authService.refreshAccessToken(refreshToken);

    return { accessToken };
  }
  
}
