import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UserService } from "src/modules/user/user.service";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: "email" })
  }

  async validate(email: string, password: string) {
    return await this.userService.validateUser(email, password);
  }

}