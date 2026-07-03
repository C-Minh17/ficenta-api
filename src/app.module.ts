import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './modules/wallet/wallet.module';
import { CategoryModule } from './modules/category/category.module';
import { TransferModule } from './modules/transfer/transfer.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.SERVER_ADDRESS as string),
    AuthModule,
    UserModule,
    WalletModule,
    CategoryModule,
    TransferModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
