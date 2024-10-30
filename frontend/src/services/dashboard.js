export const DashboardKey = Symbol;

export class Dashboard extends EventTarget {
    constructor(apiHost) {
        super();

        this.apiHost = apiHost;
        this.socket = this._createSocket();
    }

    updateRange(newRangePercentage) {
        const msg = {
            type: "newRange",
            payload: {
                percentage: newRangePercentage
            }
        };
        this._sendMessage(msg)
    }

    _createSocket() {
        const socket = new WebSocket(`ws://${this.apiHost}`);

        socket.addEventListener('error', this._handleSocketError.bind(this));
        socket.addEventListener('message', this._handleSocketMessage.bind(this));

        return socket;
    }

    _handleSocketError(err) {
        console.error('Could not connect to API backend', err);
    }

    _handleSocketMessage(evt) {
        const msgData = JSON.parse(evt.data);
        switch (msgData.type) {
            case 'number': 
                this._handleNumberMessage(msgData.payload);
                break;
            case 'range':
                this._handleRangeMessage(msgData.payload);
                break;
        }
    }

    _handleNumberMessage(numberMessage) { 
        const { value, timestamp } = numberMessage;

        const numberEntry = { value, date: new Date(timestamp) };

        const numberEvent = new CustomEvent("number", { detail: numberEntry });
        this.dispatchEvent(numberEvent);
    }

    _handleRangeMessage(rangeMessage) { 
        const { percentage } = rangeMessage;

        const range = {
            percentage
        };
        
        const numberEvent = new CustomEvent("range", { detail: range });
        this.dispatchEvent(numberEvent);
    }

    _sendMessage(msg) {
        this.socket.send(JSON.stringify(msg));
    }
}
