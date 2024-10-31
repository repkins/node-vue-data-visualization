export const DashboardKey = Symbol;

export class Dashboard extends EventTarget {
  constructor(apiHost) {
    super();

    this.apiHost = apiHost;
    this.createSocket();
  }

  updateRange(newRangePercentage) {
    const msg = {
      type: 'newRange',
      payload: {
        percentage: newRangePercentage,
      },
    };
    this.sendMessage(msg);
  }

  createSocket() {
    const socket = new WebSocket(`ws://${this.apiHost}`);

    socket.addEventListener('open', this.handleSocketOpen.bind(this));
    socket.addEventListener('error', this.handleSocketError.bind(this));
    socket.addEventListener('close', this.handleSocketClose.bind(this));
    socket.addEventListener('message', this.handleSocketMessage.bind(this));

    this.socket = socket;
  }

  handleSocketOpen() {
    const connectedEvent = new CustomEvent('connected');
    this.dispatchEvent(connectedEvent);
  }

  static handleSocketError() {
  }

  handleSocketClose() {
    const disconnectedEvent = new CustomEvent('disconnected');
    this.dispatchEvent(disconnectedEvent);

    this.createSocket();
  }

  handleSocketMessage(evt) {
    const msgData = JSON.parse(evt.data);
    switch (msgData.type) {
      case 'numbers':
        this.handleNumbersMessage(msgData.payload);
        break;
      case 'range':
        this.handleRangeMessage(msgData.payload);
        break;
      case 'dataLoaded':
        this.handleDataLoadedMessage(msgData.payload);
        break;
      default:
        break;
    }
  }

  handleNumbersMessage(numbersMessage) {
    const numberEntries = numbersMessage.map(({ value, timestamp }) => ({
      value,
      date: new Date(timestamp),
    }));

    const numberEvent = new CustomEvent('numbers', { detail: numberEntries });
    this.dispatchEvent(numberEvent);
  }

  handleRangeMessage(rangeMessage) {
    const { percentage } = rangeMessage;

    const range = { percentage };

    const numberEvent = new CustomEvent('range', { detail: range });
    this.dispatchEvent(numberEvent);
  }

  handleDataLoadedMessage(dataLoadedMessage) {
    const dataLoaded = {
      date: new Date(dataLoadedMessage.date),
    };

    const dataLoadedEvent = new CustomEvent('dataLoaded', { detail: dataLoaded });
    this.dispatchEvent(dataLoadedEvent);
  }

  sendMessage(msg) {
    this.socket.send(JSON.stringify(msg));
  }
}
