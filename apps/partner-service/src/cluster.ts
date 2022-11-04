import { Logger } from "@nestjs/common";
import cluster from "node:cluster";
import * as os from "node:os";

export class Cluster {
    public static register(callback: () => Promise<void>): void {
        const logger = new Logger(Cluster.name);
        if (cluster.isPrimary) {
            logger.log(`[MASTER] Master server started with pid: ${process.pid}`);

            // Ensure workers exit cleanly
            process.on("SIGINT", () => {
                logger.log("[MASTER] Cluster shutting down...");
                for (const id in cluster.workers) {
                    cluster.workers[id].kill();
                }
                // exit the master process
                process.exit(0);
            });

            // Start workers for number of cpus
            const cpus = os.cpus().length;
            for (let i = 0; i < cpus; i++) {
                cluster.fork();
            }

            cluster.on("online", function (worker) {
                logger.log(`[WORKER-ONLINE] Worker ${worker.process.pid} is online`);
            });

            cluster.on("exit", (worker, code, signal) => {
                if (signal) {
                    logger.log(`[WORKER-EXIT] Worker was killed by signal: ${signal}`);
                } else if (code !== 0) {
                    logger.log(`[WORKER-EXIT] Worker exited with error code: ${code}`);
                } else {
                    logger.log("[WORKER-EXIT] Worker gracefully shutdown");
                }

                logger.log(`[MASTER] Restarting new worker...`);
                cluster.fork();
            });
        } else {
            logger.log(`[WORKER] Worker server started with pid: ${process.pid}`);
            callback();
        }
    }
}
