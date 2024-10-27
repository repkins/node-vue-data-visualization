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
                this.onNumberNewListener(listener);
            }
        });
    }

    onNumberNewListener(listener) {
        var firstNumber = this.getRandomNumber();
        listener(firstNumber);

        this.lastNumber = firstNumber;

        this.setInterval(this.generateNumber.bind(this), 1000);
    }

    generateNumber() {
        let newNumber;
        do {
            newNumber = this.getRandomNumber();
        } 
        while (Math.abs(newNumber - this.lastNumber) > 30);

        this.emitNumber(newNumber);

        this.lastNumber = newNumber;
    }

    getRandomNumber()
    {
        let randomNumber = this.random() * 100;
        return randomNumber;
    }

    emitNumber(number)
    {
        this.emit('number', number);
    }
}
