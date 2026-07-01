import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường thừa không được khai báo trong DTO gửi lên
      transform: true, // Tự động chuyển đổi kiểu dữ liệu (ví dụ: chuyển string "10" thành number 10 nếu DTO khai báo kiểu number)
    }),
  );
  await app.listen(process.env.SERVER_PORT ?? 3000);
}
bootstrap();
