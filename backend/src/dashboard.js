

export class DashboardController
{
    constructor(numberGenerator)
    {
        this._numberGenerator = numberGenerator;
    }

    /**
     * Handles new client connection.
     * @param {WebSocket} ws Newly connected client socket
     */
    clientConnected(ws)
    {
        const onGeneratedNumber = number =>
        {
            ws.send(number);
        }

        this._numberGenerator.on('number', onGeneratedNumber);

        ws.on('error', () => {
            this._numberGenerator.off('number', onGeneratedNumber);
        });

        ws.on('close', () => {
            this._numberGenerator.off('number', onGeneratedNumber);
        });
    }
}
