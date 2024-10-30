export class NumbersRepository
{
    constructor()
    {
        this._numberEntries = [];
    }

    hasNumberEntries()
    {
        return this._numberEntries.length > 0;
    }

    getNumberEntriesCount()
    {
        return this._numberEntries.length;
    }

    getNumberEntries()
    {
        return this._numberEntries;
    }

    getLastNumberEntry()
    {
        return this._numberEntries[this._numberEntries.length-1];
    }

    addNumberEntry(numberEntry)
    {
        this._numberEntries.push(numberEntry);
    }

    removeFirstNumbers(count)
    {
        this._numberEntries.splice(0, count);
    }
}
