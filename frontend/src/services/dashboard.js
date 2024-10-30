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
        socket.addEventListener('close', this._handleSocketClose.bind(this));
        socket.addEventListener('message', this._handleSocketMessage.bind(this));

        return socket;
    }

    _handleSocketError(err) {
        console.error('Could not connect to API backend', err);
    }

    _handleSocketClose() {
        this._createSocket();
    }

    _handleSocketMessage(evt) {
        const msgData = JSON.parse(evt.data);
        switch (msgData.type) {
            case 'numbers': 
                this._handleNumbersMessage(msgData.payload);
                break;
            case 'range':
                this._handleRangeMessage(msgData.payload);
                break;
        }
    }

    _handleNumbersMessage(numbersMessage) {
        const numberEntries = numbersMessage.map(({ value, timestamp }) => ({ value, date: new Date(timestamp) }))

        const numberEvent = new CustomEvent("numbers", { detail: numberEntries });
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
