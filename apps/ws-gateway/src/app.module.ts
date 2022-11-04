import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppGateway } from "./app.gateway";
import { BullModule } from "@nestjs/bull";
import C from "./constants";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: C.PARTNER_SERVICE_NAME,
                transport: Transport.REDIS,
                options: {
                    host: "localhost",
                    port: 6379
                }
            }
        ]),
        BullModule.forRoot({
            redis: {
                host: "localhost",
                port: 6379
            }
        }),
        BullModule.registerQueue({
            name: "redis"
        })
    ],
    controllers: [AppController],
    providers: [AppService, AppGateway]
})
export class AppModule {}
