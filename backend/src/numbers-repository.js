import fs from 'node:fs/promises';

const NumbersFilePath = './numbers.json';

export class NumbersRepository
{
    constructor()
    {
        this._numberEntries = null;
    }

    async hasNumberEntries()
    {
        await this._ensureNumbersLoaded();

        return this._numberEntries.length > 0;
    }

    async getNumberEntriesCount()
    {
        await this._ensureNumbersLoaded();

        return this._numberEntries.length;
    }

    async getNumberEntries()
    {
        await this._ensureNumbersLoaded();

        return this._numberEntries;
    }

    async getLastNumberEntry()
    {
        await this._ensureNumbersLoaded();

        return this._numberEntries[this._numberEntries.length-1];
    }

    async addNumberEntry(numberEntry)
    {
        await this._ensureNumbersLoaded();

        this._numberEntries.push(numberEntry);

        this._writeNumbers();
    }

    async removeFirstNumbers(count)
    {
        await this._ensureNumbersLoaded();

        this._numberEntries.splice(0, count);
    }

    async _ensureNumbersLoaded()
    {
        if (!this._numberEntries)
        {
            await this._readNumbers();
        }
    }

    async _readNumbers()
    {
        try {
            const content = await fs.readFile(NumbersFilePath, { encoding: 'utf8' });
            this._numberEntries = JSON.parse(content);
        } catch (err) {
            switch (err.code) {
                case 'ENOENT':
                    console.log(`File at ${NumbersFilePath} does not exist`);
            }
            this._numberEntries = [];
        }
    }

    async _writeNumbers()
    {
        try {
            const content = JSON.stringify(this._numberEntries);
            await fs.writeFile(NumbersFilePath, content);
        } catch (err) {
            console.log(err);
        }
    }
}
