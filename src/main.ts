import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/http-exception.filters';
import morgan = require('morgan');


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(morgan('dev'));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
}
bootstrap();