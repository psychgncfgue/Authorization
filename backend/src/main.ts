import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'; // Импортируйте cookie-parser

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Настройки CORS
    app.enableCors({
        origin: 'http://localhost:3001',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    });

    // Настройка cookie-parser middleware
    app.use(cookieParser());

    await app.listen(3000);
}
bootstrap();