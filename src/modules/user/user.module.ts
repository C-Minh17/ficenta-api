import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from './schema/user.schema';
import { RefreshToken, schemaRefreshToken } from './schema/token.schema';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [MongooseModule.forFeature([
    { name: Users.name, schema: UserSchema },
    { name: RefreshToken.name, schema: schemaRefreshToken }
  ])],
  exports: [UserService],
})
export class UserModule { }
