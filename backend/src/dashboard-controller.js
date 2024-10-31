export default class DashboardController {
  constructor(numberGenerator) {
    this._numberGenerator = numberGenerator;
  }

  clientConnected(ws) {
    function onNumbers(numberEntries) {
      this.constructor._sendMessage(ws, 'numbers', numberEntries);
    }

    function onRange(range) {
      this.constructor._sendMessage(ws, 'range', range);
    }

    function onDataLoaded(loadedData) {
      this.constructor._sendMessage(ws, 'dataLoaded', loadedData);
    }

    this._registerHandler('numbers', onNumbers.bind(this), ws);
    this._registerHandler('range', onRange.bind(this), ws);
    this._registerHandler('dataLoaded', onDataLoaded.bind(this), ws);

    ws.on('message', this._onMessage.bind(this));
  }

  _registerHandler(evtName, handler, ws) {
    this._numberGenerator.on(evtName, handler);
    ws.on('error', () => {
      this._numberGenerator.off(evtName, handler);
    });
    ws.on('close', () => {
      this._numberGenerator.off(evtName, handler);
    });
  }

  _onMessage(wsMsg) {
    const msg = JSON.parse(wsMsg);
    switch (msg.type) {
      case 'newRange':
        this._numberGenerator.updateRange(msg.payload);
        break;
      default:
        break;
    }
  }

  static _sendMessage(ws, type, payload) {
    const msg = { type, payload };
    ws.send(JSON.stringify(msg));
  }
}
