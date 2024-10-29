

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
        const onGeneratedNumber = numberEntry =>
        {
            ws.send(JSON.stringify(numberEntry));
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
