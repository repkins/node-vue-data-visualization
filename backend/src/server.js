import { WebSocketServer } from "ws";
import { NumberGenerator } from "./number-generator.js";

const webSocketServerOptions = {
    port: process.env.PORT || 8080
};

const wss = new WebSocketServer(webSocketServerOptions, () => {
    console.log(`WebSocket Server listening on ${wss.options.port}`);
});

wss.on('connection', onSocketConnection);

const numberGenerator = new NumberGenerator(Math.random, setInterval);

/**
 * Handles new connections to WebSocket server
 * @param {WebSocket} ws Newly connected client socket
 */
function onSocketConnection(ws) 
{
    const onNumber = number => {
        ws.send(number);
    };

    numberGenerator.on('number', onNumber);

    ws.on('error', err => {
        console.error(err);

        numberGenerator.off('number', onNumber);
    });

    ws.on('close', () => {
        numberGenerator.off('number', onNumber);
    });

    ws.on('message', msg => {
        console.log('received: %s', msg);
    });
}

