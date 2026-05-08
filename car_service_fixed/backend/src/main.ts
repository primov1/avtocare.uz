import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);

    // ── Global prefix ──────────────────────────────────────────────
    app.setGlobalPrefix('api/v1');

    // ── Validation ─────────────────────────────────────────────────
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    // ── CORS ───────────────────────────────────────────────────────
    // Ruxsat berilgan manzillar ro'yxati
    const allowedOrigins = [
        process.env.FRONTEND_URL,        // .env dagi URL
        'http://localhost:3000',         // Backend o'zi
        'http://localhost:3001',         // Eski frontend porti
        'http://localhost:3002',         // SIZNING HOZIRGI FRONTEND PORTINGIZ
        'http://127.0.0.1:3002',        // Ba'zan brauzer IP bilan yuboradi
    ].filter(Boolean); // null yoki undefined qiymatlarni olib tashlaydi

    app.enableCors({
        origin: (origin, cb) => {
            // Agar so'rov origin-siz kelsa (masalan, Postman) yoki ro'yxatda bo'lsa ruxsat berish
            if (!origin || allowedOrigins.some(o => o === origin)) {
                cb(null, true);
            } else {
                logger.error(`Blocked by CORS: ${origin}`);
                cb(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        credentials: true,
    });

    // ── Swagger ────────────────────────────────────────────────────
    const swaggerConfig = new DocumentBuilder()
        .setTitle('AutoCare Ecosystem API')
        .setDescription('Avtomobil xizmat platformasi — REST API')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
        .addTag('auth', 'Autentifikatsiya')
        .addTag('driver', 'Haydovchi paneli')
        .addTag('workshop', 'Ustaxona paneli')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });

    const port = parseInt(process.env.PORT || '3000');
    await app.listen(port);

    logger.log(`🚀 API running at http://localhost:${port}/api/v1`);
    logger.log(`📖 Swagger docs at http://localhost:${port}/api/docs`);
    logger.log(`✅ Allowed Origins: ${allowedOrigins.join(', ')}`);
}

bootstrap();