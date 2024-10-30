

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
        const onGeneratedNumber = numberEntry => {
            const wsMsg = {
                type: 'number',
                payload: numberEntry
            }
            this._sendMessage(ws, wsMsg);
        }

        const onRangeRatio = rangeRatio => {
            const wsMsg = {
                type: 'range',
                payload: {
                    percentage: rangeRatio * 100
                }
            }
            this._sendMessage(ws, wsMsg);
        };

        this._numberGenerator.on('number', onGeneratedNumber);
        this._numberGenerator.on('rangeRatio', onRangeRatio);

        ws.on('error', () => {
            this._numberGenerator.off('number', onGeneratedNumber);
            this._numberGenerator.off('rangeRatio', onRangeRatio);
        });

        ws.on('close', () => {
            this._numberGenerator.off('number', onGeneratedNumber);
            this._numberGenerator.off('rangeRatio', onRangeRatio);
        });

        ws.on('message', this._onMessage.bind(this));
    }

    _onMessage(wsMsg)
    {
        const msg = JSON.parse(wsMsg);
        switch (msg.type) {
            case 'newRange': 
                this._numberGenerator.updateRange(msg.payload.percentage / 100);
                break;
        }
    }

    _sendMessage(ws, msg)
    {
        ws.send(JSON.stringify(msg));
    }
}
