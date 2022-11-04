import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { WsAdapter } from "@nestjs/platform-ws";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    app.useWebSocketAdapter(new WsAdapter(app));
    // app.enableCors();

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.REDIS,
        options: {
            host: "localhost",
            port: 6380
        }
    });

    await app.startAllMicroservices();

    await app.listen(3000, () => {
        const logger = new Logger("NestBootstrap");
        logger.log(`Listening at http://localhost:${3000}`);
    });
}

bootstrap();
