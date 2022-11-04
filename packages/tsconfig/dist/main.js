"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const platform_ws_1 = require("@nestjs/platform-ws");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
    app.connectMicroservice({
        transport: microservices_1.Transport.REDIS,
        options: {
            host: "localhost",
            port: 6380
        }
    });
    await app.startAllMicroservices();
    await app.listen(3000, () => {
        const logger = new common_1.Logger("NestBootstrap");
        logger.log(`Listening at http://localhost:${3000}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map