

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
        const onNumbers = numberEntries => {
            const wsMsg = {
                type: 'numbers',
                payload: numberEntries
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

        this._numberGenerator.on('numbers', onNumbers);
        this._numberGenerator.on('rangeRatio', onRangeRatio);

        ws.on('error', () => {
            this._numberGenerator.off('numbers', onNumbers);
            this._numberGenerator.off('rangeRatio', onRangeRatio);
        });

        ws.on('close', () => {
            this._numberGenerator.off('numbers', onNumbers);
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
