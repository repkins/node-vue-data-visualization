import { EventEmitter } from 'node:events';

const MaxNumbers = 15;
const RangeRatio = 0.30;
const IntervalSeconds = 1;

export default class NumberGenerator extends EventEmitter {
  constructor(random, setInterval, numbersRepository) {
    super();
    this._random = random;
    this._setInterval = setInterval;
    this._numbersRepository = numbersRepository;

    this._rangeRatio = RangeRatio;

    this._numbersRepository.loadNumberEntries()
      .then(this._onLoadNumbers.bind(this));
  }

  updateRange(newRangeRatio) {
    this._rangeRatio = newRangeRatio;
    this.emit('rangeRatio', newRangeRatio);
  }

  _onLoadNumbers() {
    this._dateNumbersLoaded = new Date();

    this._setInterval(this._generateNumber.bind(this), IntervalSeconds * 1000);

    this.on('newListener', this._onNewListener.bind(this));
  }

  _onNewListener(evtName, listener) {
    switch (evtName) {
      case 'numbers':
        listener(this._numbersRepository.getNumberEntries());
        break;
      case 'rangeRatio':
        listener(this._rangeRatio);
        break;
      case 'dataLoaded':
        listener(this._dateNumbersLoaded);
        break;
      default:
        break;
    }
  }

  _generateNumber() {
    let newNumberEntry = this._getRandomNumber();

    if (this._numbersRepository.hasNumberEntries()) {
      const lastNumberEntry = this._numbersRepository.getLastNumberEntry();

      const rationedRange = lastNumberEntry.value * this._rangeRatio;
      while (Math.abs(newNumberEntry.value - lastNumberEntry.value) > rationedRange) {
        newNumberEntry = this._getRandomNumber();
      }
    }

    this._emitNumber(newNumberEntry);
    this._numbersRepository.addNumberEntry(newNumberEntry);

    const numberEntriesCount = this._numbersRepository.getNumberEntriesCount();
    if (numberEntriesCount > MaxNumbers) {
      this._numbersRepository.removeFirstNumbers(numberEntriesCount - MaxNumbers);
    }
  }

  _getRandomNumber() {
    const randomNumber = this._random() * 100;
    const timestamp = Date.now();

    return {
      value: randomNumber,
      timestamp,
    };
  }

  _emitNumber(numberEntry) {
    this.emit('numbers', [numberEntry]);
  }
}
