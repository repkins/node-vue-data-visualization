import { EventEmitter } from "node:events";
import { NumbersRepository } from "./numbers-repository.js";

const MaxNumbers = 15,
      RangeRatio = 0.30,
      IntervalSeconds = 1;

export class NumberGenerator extends EventEmitter
{
    /**
     * Creates new number generator
     * @param {() => number} random Random function
     * @param {(handler: Function, timeout?: number) => void} setInterval Interval setting function
     * @param {NumbersRepository} numbersRepository Numbers repository instance
     */
    constructor(random, setInterval, numbersRepository)
    {
        super();
        this._random = random;
        this._setInterval = setInterval;
        this._numbersRepository = numbersRepository;

        this._rangeRatio = RangeRatio;

        this._setInterval(this._generateNumber.bind(this), IntervalSeconds * 1000);

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
                listener(this._numbersRepository.getNumberEntries());
                break;
            case 'rangeRatio':
                listener(this._rangeRatio);
                break;
        }
    }

    _generateNumber() {
        let newNumberEntry = this._getRandomNumber();

        if (this._numbersRepository.hasNumberEntries()) {
            const lastNumberEntry = this._numbersRepository.getLastNumberEntry();

            let rationedRange = lastNumberEntry.value * this._rangeRatio;
            while (Math.abs(newNumberEntry.value - lastNumberEntry.value) > rationedRange)
            {
                newNumberEntry = this._getRandomNumber();
            } 
        }

        this._emitNumber(newNumberEntry);
        this._numbersRepository.addNumberEntry(newNumberEntry);

        if (this._numbersRepository.getNumberEntriesCount() > MaxNumbers) {
            this._numbersRepository.removeFirstNumbers(this._numbersRepository.getNumberEntriesCount() - MaxNumbers);
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
