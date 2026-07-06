import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường thừa không được khai báo trong DTO gửi lên
      transform: true, // Tự động chuyển đổi kiểu dữ liệu (ví dụ: chuyển string "10" thành number 10 nếu DTO khai báo kiểu number)
    }),
  );

  // Đọc file swagger.json đã tạo
  const swaggerDocumentPath = path.join(process.cwd(), 'src', 'common', 'utils', 'swagger.json');
  if (fs.existsSync(swaggerDocumentPath)) {
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerDocumentPath, 'utf8'));
    // Thiết lập router /api để hiển thị tài liệu
    app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } else {
    console.warn(`Swagger file not found at: ${swaggerDocumentPath}`);
  }
  await app.listen(process.env.SERVER_PORT ?? 3000);
}
bootstrap();
