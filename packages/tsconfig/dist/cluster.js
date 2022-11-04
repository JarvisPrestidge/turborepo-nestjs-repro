"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cluster = void 0;
const common_1 = require("@nestjs/common");
const node_cluster_1 = require("node:cluster");
const os = require("node:os");
class Cluster {
    static register(callback) {
        const logger = new common_1.Logger(Cluster.name);
        if (node_cluster_1.default.isPrimary) {
            logger.log(`[MASTER] Master server started with pid: ${process.pid}`);
            process.on("SIGINT", () => {
                logger.log("[MASTER] Cluster shutting down...");
                for (const id in node_cluster_1.default.workers) {
                    node_cluster_1.default.workers[id].kill();
                }
                process.exit(0);
            });
            const cpus = os.cpus().length;
            for (let i = 0; i < cpus; i++) {
                node_cluster_1.default.fork();
            }
            node_cluster_1.default.on("online", function (worker) {
                logger.log(`[WORKER-ONLINE] Worker ${worker.process.pid} is online`);
            });
            node_cluster_1.default.on("exit", (worker, code, signal) => {
                if (signal) {
                    logger.log(`[WORKER-EXIT] Worker was killed by signal: ${signal}`);
                }
                else if (code !== 0) {
                    logger.log(`[WORKER-EXIT] Worker exited with error code: ${code}`);
                }
                else {
                    logger.log("[WORKER-EXIT] Worker gracefully shutdown");
                }
                logger.log(`[MASTER] Restarting new worker...`);
                node_cluster_1.default.fork();
            });
        }
        else {
            logger.log(`[WORKER] Worker server started with pid: ${process.pid}`);
            callback();
        }
    }
}
exports.Cluster = Cluster;
//# sourceMappingURL=cluster.js.map