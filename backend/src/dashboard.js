export default class DashboardController {
  constructor(numberGenerator) {
    this._numberGenerator = numberGenerator;
  }

  clientConnected(ws) {
    function onNumbers(numberEntries) {
      const wsMsg = {
        type: 'numbers',
        payload: numberEntries,
      };
      this.constructor._sendMessage(ws, wsMsg);
    }

    function onRangeRatio(rangeRatio) {
      const wsMsg = {
        type: 'range',
        payload: {
          percentage: rangeRatio * 100,
        },
      };
      this.constructor._sendMessage(ws, wsMsg);
    }

    function onDataLoaded(date) {
      const wsMsg = {
        type: 'dataLoaded',
        payload: {
          date: date.toISOString(),
        },
      };
      this.constructor._sendMessage(ws, wsMsg);
    }

    this._registerHandler('numbers', onNumbers.bind(this), ws);
    this._registerHandler('rangeRatio', onRangeRatio.bind(this), ws);
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
        this._numberGenerator.updateRange(msg.payload.percentage / 100);
        break;
      default:
        break;
    }
  }

  static _sendMessage(ws, msg) {
    ws.send(JSON.stringify(msg));
  }
}
