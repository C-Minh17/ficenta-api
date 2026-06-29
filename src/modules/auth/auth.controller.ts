import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import createUserDto from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import LoginDto from './dto/login.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { locaAuthGuard } from 'src/guards/local-auth.guard';
import { TransformResponseInterceptor } from 'src/common/interceptor/transform-response.interceptor';

@UseInterceptors(TransformResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  @Post("/register")
  register(@Body() userData: createUserDto) {
    return this.userService.createUser(userData)
  }

  @UseGuards(locaAuthGuard)
  @Post("/login")
  Login(@Req() req: any) {
    return this.authService.Login(req.user)
  }

  @Post('/refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me")
  getProfile(@Req() req: any) {
    return req.user
  }
}
