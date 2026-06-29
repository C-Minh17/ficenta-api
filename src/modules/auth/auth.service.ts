import { Injectable, UnauthorizedException } from '@nestjs/common';
import LoginDto from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) { }

  async Login(data: any) {
    const payload = {
      email: data.email,
      sub: data._id,
    }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "30m"
    })

    const RefreshToken = this.jwtService.sign(payload, {
      expiresIn: "7d"
    })

    await this.userService.storeRefreshToken(data._id, RefreshToken, 7)

    return {
      access_token: accessToken,
      refresh_token: RefreshToken
    }
  }

  async refreshTokens(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_SECRET
    })

    const storedToken = await this.userService.findRefreshToken(refreshToken)
    if (!storedToken) {
      throw new UnauthorizedException("Token không hợp lệ hoặc không tồn tại!")
    }

    if (storedToken.revoked || storedToken.replacedByToken) {
      await this.userService.revokeAllTokensForUser(payload.sub)
      throw new UnauthorizedException("Cảnh báo bảo mật: Token đã được sử dụng trước đó!");
    }

    const newPayload = {
      email: payload.email,
      sub: payload.sub
    }
    const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
    const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

    storedToken.revoked = true;
    storedToken.replacedByToken = this.userService.hashToken(newRefreshToken);
    await storedToken.save();

    await this.userService.storeRefreshToken(payload.sub, newRefreshToken, 7);
    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }


}
