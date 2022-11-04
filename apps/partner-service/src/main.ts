import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestFactory } from "@nestjs/core";
import { Cluster } from "./cluster";
import { AppModule } from "./app.module";

const bootstrap = async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.REDIS,
        options: {
            host: "localhost",
            port: 6380
        }
    });
    await app.listen();
};

// Cluster.register(bootstrap);

bootstrap();
