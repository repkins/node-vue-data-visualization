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
        this._random = random;
        this._setInterval = setInterval;

        this._rangeRatio = 0.30;
        this._lastNumberEntries = [];

        this._setInterval(this._generateNumber.bind(this), 1000);

        this.on('newListener', this._onNewListener.bind(this));
    }

    updateRange(newRangeRatio)
    {
        this._rangeRatio = newRangeRatio;
        this.emit('rangeRatio', newRangeRatio);
    }

    _onNewListener(evtName, listener)
    {
        switch (evtName) {
            case 'numbers': 
                listener(this._lastNumberEntries);
                break;
            case 'rangeRatio':
                listener(this._rangeRatio);
                break;
        }
    }

    _generateNumber() {
        let newNumberEntry = this._getRandomNumber();

        if (this._lastNumberEntries.length > 0) {
            const lastNumberEntry = this._lastNumberEntries[this._lastNumberEntries.length-1];

            let rationedRange = lastNumberEntry.value * this._rangeRatio;
            while (Math.abs(newNumberEntry.value - lastNumberEntry.value) > rationedRange)
            {
                newNumberEntry = this._getRandomNumber();
            } 
        }

        this._emitNumber(newNumberEntry);
        this._lastNumberEntries.push(newNumberEntry);

        const maxNumbers = 15;

        if (this._lastNumberEntries.length > maxNumbers) {
            this._lastNumberEntries.splice(0, this._lastNumberEntries.length - maxNumbers);
        }
    }

    _getRandomNumber()
    {
        const randomNumber = this._random() * 100;
        const timestamp = Date.now();

        return {
            value: randomNumber, 
            timestamp
        };
    }

    _emitNumber(numberEntry)
    {
        this.emit('numbers', [ numberEntry ]);
    }
}
