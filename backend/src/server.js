import { WebSocketServer } from "ws";
import "dotenv/config";

import { NumberGenerator } from "./number-generator.js";
import { DashboardController } from "./dashboard.js";
import { NumbersRepository } from "./numbers-repository.js";

const webSocketServerOptions = {
    port: process.env.PORT || 8080
};

const wss = new WebSocketServer(webSocketServerOptions, () => {
    console.log(`WebSocket Server listening on ${wss.options.port}`);
});

wss.on('connection', onSocketConnection);

const numbersRepository = new NumbersRepository();
const numberGenerator = new NumberGenerator(Math.random, setInterval, numbersRepository);
const dashboardController = new DashboardController(numberGenerator);

/**
 * Handles new connections to WebSocket server.
 * @param {WebSocket} ws Newly connected client socket
 */
function onSocketConnection(ws) 
{
    console.log(`WebSocket client connected`);

    ws.on('error', err => {
        console.error(`WebSocket client error occured: `, err);
    });
    
    ws.on('close', () => {
        console.log(`WebSocket client disconnected`);
    });

    dashboardController.clientConnected(ws);
}
