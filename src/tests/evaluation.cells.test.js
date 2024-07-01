import puppeteer from 'puppeteer';

import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';

function getSeriesValue(n, series) {
    // Determine the letter: A for even index, B for odd index
    const letter = series[n % series.length];

    // Determine the number: n divided by 2, using integer division
    const number = Math.floor(n / series.length);

    // Combine the letter and number to form the series value
    return letter + number;
}

describe('Puppeteer evaluation number of cells increased', () => {
    //Performance tests with functions that have same number of references but increasing the number of cells and % of cells that are functions.
    let browser;
    let page1;

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: 'new' });
        page1 = await browser.newPage();
        await page1.goto('http://localhost:5173');
    });

    beforeEach(async () => {
        await page1.waitForSelector('#clearButton');
        const button = await page1.$('[id="clearButton"]');
        await button.evaluate((ele) => ele.click());

        await page1.evaluate(() => {
            window.scrollTo(0, 0);
        });
    });

    afterAll(async () => {
        await browser.close();
    });

    it('1 cell with 1 function', async () => {
        let initialTime = Date.now();
        await page1.waitForSelector('#A0');
        let timeToSetup = Date.now() - initialTime;
        console.log(`Time to SETUP: ${timeToSetup} ms`);

        await page1.type('#B0', '5');
        await page1.type('#C0', '5');

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);

        let initialFunctionTime = Date.now();

        const a0 = await page1.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page1.type('#functionInput', '=SUM(B0;C0)');
        await page1.click('#functionInputButton');

        let textValue = await page1.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('10');

        let timeToFunction = Date.now() - initialFunctionTime;
        console.log(`Time to FUNCTION: ${timeToFunction} ms`);
    });

    /**
     * Has 2 cells A5 and B5 that are always values
     */
    it('10 cells with 1,3,7,10 functions', async () => {
        await page1.waitForSelector('#ColHeadC');
        await page1.click('#ColHeadC', { button: 'right' });
        await page1.click('#column');

        let initialTime = Date.now();
        await page1.waitForSelector('#A0');
        for (let i = 0; i < 3; i++) {
            await page1.click('#RowHead2', { button: 'right' });
            await page1.click('#below');
        }
        let timeToSetup = Date.now() - initialTime;
        console.log(`Time to SETUP: ${timeToSetup} ms`);
        for (let i = 0; i < 6; i++) {
            await page1.type('#A' + i, '5');
            await page1.type('#B' + i, '5');
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);

        let initialFunctionTime = Date.now();

        for (let i = 0; i < 10; i++) {
            if (i == 1 || i == 3 || i == 7) {
                let timeToFunction = Date.now() - initialFunctionTime;
                console.log(`Time to ${i} FUNCTIONS: ${timeToFunction} ms`);
            }
            let currentCellId = getSeriesValue(i, ['A', 'B']);
            let currentCell = await page1.$(`[id="${currentCellId}"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.type('#functionInput', `=SUM(A5;B5)`);
            await page1.click('#functionInputButton');
        }
        let timeToFunction = Date.now() - initialFunctionTime;
        console.log(`Time to 10 FUNCTIONS: ${timeToFunction} ms`);
        let textValue = await page1.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('10');
    });

    /**
     * Has 2 extra cells at A25-B25
     */
    it('50 cells with 5,15,35,50 functions', async () => {
        let initialTime = Date.now();
        await page1.waitForSelector('#A0');
        await page1.click('#ColHeadC', { button: 'right' });
        await page1.click('#column');
        for (let i = 0; i < 23; i++) {
            await page1.click('#RowHead2', { button: 'right' });
            await page1.click('#below');
        }
        let timeToSetup = Date.now() - initialTime;
        console.log(`Time to SETUP: ${timeToSetup} ms`);
        for (let i = 0; i < 26; i++) {
            await page1.type('#A' + i, '5');
            await page1.type('#B' + i, '5');
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);
        let initialFunctionTime = Date.now();
        let timeToFunction;

        for (let i = 0; i < 50; i++) {
            if (i == 5 || i == 15 || i == 35) {
                timeToFunction = Date.now() - initialFunctionTime;
                console.log(`Time to ${i} FUNCTIONS: ${timeToFunction} ms`);
            }
            let currentCellId = getSeriesValue(i, ['A', 'B']);
            let currentCell = await page1.$(`[id="${currentCellId}"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.type('#functionInput', `=SUM(A25:B25)`);
            await page1.click('#functionInputButton');
        }
        timeToFunction = Date.now() - initialFunctionTime;
        console.log(`Time to 50 FUNCTIONS: ${timeToFunction} ms`);
        let textValue = await page1.$eval('#A24', (input) => input.value);
        expect(textValue).toBe('10');
    });

    /**
     * Has 4 extra cells at A25-D25
     */
    it('100 cells with 10,30,70,100 functions', async () => {
        let initialTime = Date.now();
        await page1.waitForSelector('#A0');
        await page1.click('#ColHeadC', { button: 'right' });
        await page1.click('#right');
        for (let i = 0; i < 23; i++) {
            await page1.click('#RowHead2', { button: 'right' });
            await page1.click('#below');
        }
        let timeToSetup = Date.now() - initialTime;
        console.log(`Time to SETUP: ${timeToSetup} ms`);
        for (let i = 0; i < 26; i++) {
            await page1.type('#A' + i, '5');
            await page1.type('#B' + i, '5');
            await page1.type('#C' + i, '5');
            await page1.type('#D' + i, '5');
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);
        let initialFunctionTime = Date.now();
        let timeToFunction;

        for (let i = 0; i < 100; i++) {
            if (i == 10 || i == 30 || i == 70) {
                timeToFunction = Date.now() - initialFunctionTime;
                console.log(`Time to ${i} FUNCTIONS: ${timeToFunction} ms`);
            }
            let currentCellId = getSeriesValue(i, ['A', 'B', 'C', 'D']);
            let currentCell = await page1.$(`[id="${currentCellId}"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.type('#functionInput', `=SUM(A25:D25)`);
            await page1.click('#functionInputButton');
        }
        timeToFunction = Date.now() - initialFunctionTime;
        console.log(`Time to 100 FUNCTIONS: ${timeToFunction} ms`);
        let textValue = await page1.$eval('#A24', (input) => input.value);
        expect(textValue).toBe('20');
    });

    /**
     * Has 4 extra cells at A25-D25
     */
    it('200 cells with 20,60,140,200 functions', async () => {
        let initialTime = Date.now();
        await page1.waitForSelector('#A0');
        await page1.click('#ColHeadC', { button: 'right' });
        await page1.click('#right');
        for (let i = 0; i < 48; i++) {
            await page1.click('#RowHead2', { button: 'right' });
            await page1.click('#below');
        }
        let timeToSetup = Date.now() - initialTime;
        console.log(`Time to SETUP: ${timeToSetup} ms`);
        for (let i = 0; i < 51; i++) {
            await page1.type('#A' + i, '5');
            await page1.type('#B' + i, '5');
            await page1.type('#C' + i, '5');
            await page1.type('#D' + i, '5');
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);
        let initialFunctionTime = Date.now();
        let timeToFunction;

        for (let i = 0; i < 200; i++) {
            if (i == 20 || i == 60 || i == 140) {
                timeToFunction = Date.now() - initialFunctionTime;
                console.log(`Time to ${i} FUNCTIONS: ${timeToFunction} ms`);
            }
            let currentCellId = getSeriesValue(i, ['A', 'B', 'C', 'D']);
            let currentCell = await page1.$(`[id="${currentCellId}"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.type('#functionInput', `=SUM(A50;B50)`);
            await page1.click('#functionInputButton');
        }
        timeToFunction = Date.now() - initialFunctionTime;
        console.log(`Time to 200 FUNCTIONS: ${timeToFunction} ms`);
        let textValue = await page1.$eval('#A49', (input) => input.value);
        expect(textValue).toBe('10');
    });

    /**
     * Has 4 extra cells at A25-C25
     */
    it('500 cells with 50,150,350,500 functions', async () => {
        let initialTime = Date.now();
        await page1.waitForSelector('#A0');
        await page1.click('#ColHeadC', { button: 'right' });
        await page1.click('#right');
        for (let i = 0; i < 123; i++) {
            await page1.click('#RowHead2', { button: 'right' });
            await page1.click('#below');
        }
        let timeToSetup = Date.now() - initialTime;
        console.log(`Time to SETUP: ${timeToSetup} ms`);
        for (let i = 0; i < 126; i++) {
            await page1.type('#A' + i, '5');
            await page1.type('#B' + i, '5');
            await page1.type('#C' + i, '5');
            await page1.type('#D' + i, '5');
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);
        let initialFunctionTime = Date.now();
        let timeToFunction;

        for (let i = 0; i < 500; i++) {
            if (i == 50 || i == 150 || i == 350) {
                timeToFunction = Date.now() - initialFunctionTime;
                console.log(`Time to ${i} FUNCTIONS: ${timeToFunction} ms`);
            }
            let currentCellId = getSeriesValue(i, ['A', 'B', 'C', 'D']);
            let currentCell = await page1.$(`[id="${currentCellId}"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.type('#functionInput', `=SUM(A125;B125)`);
            await page1.click('#functionInputButton');
        }
        timeToFunction = Date.now() - initialFunctionTime;
        console.log(`Time to 500 FUNCTIONS: ${timeToFunction} ms`);
        let textValue = await page1.$eval('#A49', (input) => input.value);
        expect(textValue).toBe('10');
    });
}, 5000000);
