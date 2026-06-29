import { Controller, UseInterceptors } from '@nestjs/common';
import { TransformResponseInterceptor } from 'src/common/interceptor/transform-response.interceptor';

@UseInterceptors(TransformResponseInterceptor)
@Controller('user')
export class UserController { }
