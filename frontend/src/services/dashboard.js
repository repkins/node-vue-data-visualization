export const DashboardKey = Symbol;

export class Dashboard extends EventTarget {
    constructor(apiHost) {
        super();

        this.apiHost = apiHost;
        this.socket = this._createSocket();
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
        if (msgData.type === 'number') {
            this._handleNumberMessage(msgData.payload);
        }
    }

    _handleNumberMessage(numberMessage) { 
        const { value, timestamp } = numberMessage;

        const numberEntry = { value, date: new Date(timestamp) };

        const numberEvent = new CustomEvent("number", { detail: numberEntry });
        this.dispatchEvent(numberEvent);
    }
}
