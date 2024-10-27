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
                this._onNumberNewListener(listener);
            }
        });
    }

    _onNumberNewListener(listener) {
        var firstNumber = this._getRandomNumber();
        listener(firstNumber);

        this.lastNumber = firstNumber;

        this.setInterval(this.generateNumber.bind(this), 1000);
    }

    _generateNumber() {
        let newNumber;
        do {
            newNumber = this._getRandomNumber();
        } 
        while (Math.abs(newNumber - this.lastNumber) > 30);

        this._emitNumber(newNumber);

        this.lastNumber = newNumber;
    }

    _getRandomNumber()
    {
        let randomNumber = this.random() * 100;
        return randomNumber;
    }

    _emitNumber(number)
    {
        this.emit('number', number);
    }
}
