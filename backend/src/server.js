import { WebSocketServer } from "ws";
import "dotenv/config";

import { NumberGenerator } from "./number-generator.js";
import { DashboardController } from "./dashboard.js";

const webSocketServerOptions = {
    port: process.env.PORT || 8080
};

const wss = new WebSocketServer(webSocketServerOptions, () => {
    console.log(`WebSocket Server listening on ${wss.options.port}`);
});

wss.on('connection', onSocketConnection);

const numberGenerator = new NumberGenerator(Math.random, setInterval);
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

    ws.on('message', msg => {
        console.log('received: %s', msg);
    });
}
