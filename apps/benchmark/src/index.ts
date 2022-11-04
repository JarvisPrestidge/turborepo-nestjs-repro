import { User } from "models";
import * as faker from "faker";
import { WebSocket } from "ws";

const MAX_CLIENTS = 100000;
const POLLING_PERCENTAGE = 0.05;
const CLIENT_CREATION_INTERVAL_IN_MS = 25;
const EMIT_INTERVAL_IN_MS = 1000;

const commonInterests = ["bored", "fun", "language", "football", "horny", "boobs", "news", "red", "blue", "rp"];
const commonLanguages = ["en", "de", "es", "fr", "pl"];
const commonCountries = ["uk", "germany", "spain", "france", "poland"];

let clientCount = 0;
let requestsPerSecond = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;

const userSearchTimeSet = new Map<string, number>();

setInterval(() => {
    console.log(`Currently handling ${requestsPerSecond} req/s for ${clientCount} clients`);
    requestsPerSecond = 0;
}, 1000);

const createClient = () => {
    // for demonstration purposes, some clients stay stuck in HTTP long-polling
    const transports = Math.random() < POLLING_PERCENTAGE ? ["polling"] : ["polling", "websocket"];
    // const transports = ["websocket"];

    // const socket = io(URL, {
    //     transports
    // });

    const URL = "ws://localhost:3000";
    const socket = new WebSocket(URL);

    socket.on("open", () => {
        setInterval(() => {
            const data: User = {
                id: faker.datatype.uuid().replace(/-/g, ""),
                data: {
                    age: faker.datatype.number({ min: 18, max: 100 }),
                    country: faker.random.arrayElement(commonCountries),
                    gender: faker.random.arrayElement(["male", "female"]),
                    interests: faker.random.arrayElements(commonInterests, faker.datatype.number({ min: 0, max: 5 })),
                    language: faker.random.arrayElements(commonLanguages, faker.datatype.number({ min: 0, max: 2 }))
                },
                partners: [],
                preferences: {
                    timeToSearch: 5000,
                    age: {
                        enabled: Math.random() > 0.6,
                        required: faker.datatype.boolean(),
                        min: faker.datatype.number({ min: 18, max: 45 }),
                        max: faker.datatype.number({ min: 45, max: 100 })
                    },
                    gender: {
                        enabled: Math.random() > 0.6,
                        required: faker.datatype.boolean(),
                        value: faker.random.arrayElements(["male", "female"])
                    },
                    interests: {
                        enabled: Math.random() > 0.6,
                        required: faker.datatype.boolean(),
                        value: faker.random.arrayElements(commonInterests, faker.datatype.number({ min: 0, max: 5 }))
                    },
                    country: {
                        enabled: Math.random() > 0.6,
                        required: faker.datatype.boolean(),
                        value: faker.random.arrayElements(commonCountries, faker.datatype.number({ min: 0, max: 2 }))
                    },
                    language: {
                        enabled: Math.random() > 0.6,
                        required: faker.datatype.boolean(),
                        value: faker.random.arrayElements(commonLanguages, faker.datatype.number({ min: 0, max: 2 }))
                    }
                }
            };
            // socket.emit("partner-search", data);
            // socket.emit("random-partner-search", data);
            socket.send(
                JSON.stringify({
                    event: "random-partner-search",
                    data
                })
            );
            requestsPerSecond++;
            userSearchTimeSet.set(data.id, new Date().getTime());
        }, EMIT_INTERVAL_IN_MS);

        socket.on("message", (data) => {
            const inbound = JSON.parse(data.toString());
            // console.log(inbound);
            packetsSinceLastReport++;
            const startTime = userSearchTimeSet.get(inbound.data.searchingUser.id);
            if (!startTime) {
                return;
            }
            const deltaTime = new Date().getTime() - startTime;
            console.log(
                `[PARTNER-FOUND] in ${deltaTime} ms, redisearch query took ${inbound.data.matchedUser.queryTime}`
            );
        });
    });

    // socket.on("partner-found", (data: any) => {
    //     packetsSinceLastReport++;
    //     const startTime = userSearchTimeSet.get(data.searchingUser.id);
    //     if (!startTime) {
    //         return;
    //     }
    //     const deltaTime = new Date().getTime() - startTime;
    //     console.log(`[PARTNER-FOUND] in ${deltaTime} ms, redisearch query took ${data.matchedUser.queryTime}`);
    // });

    // socket.on("random-partner-found", (data: any) => {
    //     packetsSinceLastReport++;
    //     const startTime = userSearchTimeSet.get(data.searchingUser.id);
    //     if (!startTime) {
    //         return;
    //     }
    //     const deltaTime = new Date().getTime() - startTime;
    //     console.log(`[PARTNER-FOUND] in ${deltaTime} ms, redisearch query took ${data.matchedUser.queryTime}`);
    // });

    // socket.on("disconnect", (reason) => {
    //     console.log(`disconnect due to ${reason}`);
    // });

    if (++clientCount < MAX_CLIENTS) {
        setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
    }
};

createClient();
