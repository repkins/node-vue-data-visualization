import { EventEmitter } from "node:events";

export class NumberGenerator extends EventEmitter
{
    /**
     * Creates new number generator
     * @param {() => number} random Random function
     * @param {(handler: Function, timeout?: number) => void} setInterval Interval setting function
     */
    constructor(random, setInterval)
    {
        super();
        this.random = random;
        this.setInterval = setInterval;

        this.once('newListener', (evtName, listener) => {
            if (evtName === 'number') {
                this._onNumberFirstListener(listener);
            }
        });
    }

    _onNumberFirstListener(listener) {
        var firstNumberEntry = this._getRandomNumber();
        listener(firstNumberEntry);

        this.lastNumber = firstNumberEntry.value;

        this.setInterval(this._generateNumber.bind(this), 1000);
    }

    _generateNumber() {
        let newNumberEntry;
        do {
            newNumberEntry = this._getRandomNumber();
        } 
        while (Math.abs(newNumberEntry.value - this.lastNumber) > 30);

        this._emitNumber(newNumberEntry);

        this.lastNumber = newNumberEntry.value;
    }

    _getRandomNumber()
    {
        const randomNumber = this.random() * 100;
        const timestamp = Date.now();

        return {
            value: randomNumber, 
            timestamp
        };
    }

    _emitNumber(numberEntry)
    {
        this.emit('number', numberEntry);
    }
}
