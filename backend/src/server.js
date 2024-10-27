import { WebSocketServer } from "ws";
import { NumberGenerator } from "./number-generator.js";

const webSocketServerOptions = {
    port: process.env.PORT || 8080
};

const wss = new WebSocketServer(webSocketServerOptions, () => {
    console.log(`WebSocket Server listening on ${webSocketServerOptions.port}`);
});

const numberGenerator = new NumberGenerator(Math.random, setInterval);

wss.on('connection', ws => {

    const onNumber = number => {
        ws.send(number);
    };

    numberGenerator.on('number', onNumber);
    
    ws.on('error', err => {
        console.error(err);

        numberGenerator.off('number', onNumber);
    });

    ws.on('close', () => {
        numberGenerator.off('number', onNumber)
    });
    
    ws.on('message', msg => {
        console.log('received: %s', msg);
    });
});
