import fs from 'node:fs/promises';

const NumbersFilePath = './numbers.json';

export default class NumbersRepository {
  constructor() {
    this._numberEntries = [];
  }

  async loadNumberEntries() {
    await this._readNumbers();
  }

  hasNumberEntries() {
    return this._numberEntries.length > 0;
  }

  getNumberEntriesCount() {
    return this._numberEntries.length;
  }

  getNumberEntries() {
    return this._numberEntries;
  }

  getLastNumberEntry() {
    return this._numberEntries[this._numberEntries.length - 1];
  }

  addNumberEntry(numberEntry) {
    this._numberEntries.push(numberEntry);

    this._writeNumbers();
  }

  removeFirstNumbers(count) {
    this._numberEntries.splice(0, count);
  }

  async _readNumbers() {
    try {
      const content = await fs.readFile(NumbersFilePath, { encoding: 'utf8' });
      this._numberEntries = JSON.parse(content);
    } catch (err) {
      switch (err.code) {
        case 'ENOENT':
          console.log(`File at ${NumbersFilePath} does not exist`);
          break;
        default:
          throw err;
      }
      this._numberEntries = [];
    }
  }

  async _writeNumbers() {
    try {
      const content = JSON.stringify(this._numberEntries);
      await fs.writeFile(NumbersFilePath, content);
    } catch (err) {
      console.log(err);
    }
  }
}
