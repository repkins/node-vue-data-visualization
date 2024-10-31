

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
        function onNumbers(numberEntries) {
            const wsMsg = {
                type: 'numbers',
                payload: numberEntries
            }
            this._sendMessage(ws, wsMsg);
        }

        function onRangeRatio(rangeRatio) {
            const wsMsg = {
                type: 'range',
                payload: {
                    percentage: rangeRatio * 100
                }
            }
            this._sendMessage(ws, wsMsg);
        };

        function onDataLoaded(date) {
            const wsMsg = {
                type: 'dataLoaded',
                payload: {
                    date: date.toISOString()
                }
            }
            this._sendMessage(ws, wsMsg);
        }

        this._registerHandler('numbers', onNumbers, ws);
        this._registerHandler('rangeRatio', onRangeRatio, ws);
        this._registerHandler('dataLoaded', onDataLoaded, ws);

        ws.on('message', this._onMessage.bind(this));
    }

    _registerHandler(evtName, handler, ws)
    {
        this._numberGenerator.on(evtName, handler);
        ws.on('error', () => {
            this._numberGenerator.off(evtName, handler);
        });
        ws.on('close', () => {
            this._numberGenerator.off(evtName, handler);
        });
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
