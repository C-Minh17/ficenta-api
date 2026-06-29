import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schema/user.schema';
import { Model } from 'mongoose';
import createUserDto from './dto/create-user.dto';
import * as bcrypt from "bcrypt"
import * as crypto from 'crypto';
import { RefreshToken } from './schema/token.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
    @InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshToken>
  ) { }

  async createUser(dataUser: createUserDto) {
    const isEmailExist = await this.userModel.findOne({ email: dataUser.email });
    if (isEmailExist) {
      throw new ConflictException("Email này đã được sử dụng!");
    }

    const user = new this.userModel(dataUser)
    const hashPassword = await bcrypt.hash(dataUser.password, 10)
    user.password = hashPassword
    await user.save();

    const { password, ...result } = user.toObject();
    return result;
  }

  async findUser(email: string, sub: string) {
    const user = await this.userModel.findOne({ email: email, _id: sub })
    return user
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new HttpException("Không tìm thấy email", HttpStatus.UNAUTHORIZED)
    }

    const status = await bcrypt.compareSync(password, user.password)
    if (!status) {
      throw new HttpException("Mật khẩu sai", HttpStatus.UNAUTHORIZED)
    }

    return user
  }

  hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex")
  }

  async storeRefreshToken(userId: string, token: string, ttlDay: number = 7) {
    const hashtoken = this.hashToken(token)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + ttlDay)

    const newToken = new this.refreshTokenModel({
      userId,
      token: hashtoken,
      expiresAt,
      revoked: false
    })

    return newToken.save();
  }

  async findRefreshToken(token: string) {
    const hashToken = this.hashToken(token)
    return this.refreshTokenModel.findOne({ token: hashToken })
  }

  async revokeAllTokensForUser(userId: string) {
    return this.refreshTokenModel.updateMany(
      { userId, revoked: false },
      { revoked: true }
    );
  }
}
