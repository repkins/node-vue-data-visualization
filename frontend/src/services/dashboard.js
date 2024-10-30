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
        const { value, timestamp } = JSON.parse(evt.data);

        const numberEntry = { value, date: new Date(timestamp) };

        const numberEvent = new CustomEvent("number", { detail: numberEntry });
        this.dispatchEvent(numberEvent);
    }
}
