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
            case 'number': 
                listener(this._lastNumberEntry);
                break;
            case 'rangeRatio':
                listener(this._rangeRatio);
                break;
        }
    }

    _generateNumber() {
        let newNumberEntry = this._getRandomNumber();

        if (this._lastNumberEntry) {
            let rationedRange = this._lastNumberEntry.value * this._rangeRatio;
            while (Math.abs(newNumberEntry.value - this._lastNumberEntry.value) > rationedRange)
            {
                newNumberEntry = this._getRandomNumber();
            } 
        }

        this._emitNumber(newNumberEntry);

        this._lastNumberEntry = newNumberEntry;
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
        this.emit('number', numberEntry);
    }
}
