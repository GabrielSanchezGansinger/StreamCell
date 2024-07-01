import puppeteer from 'puppeteer';

import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';

function getSeriesValue(n, series) {
    // Determine the letter: A for even index, B for odd index
    const letter = series[n % series.length];

    // Determine the number: n divided by 2, using integer division
    const number = Math.floor(n / series.length) + 1;

    // Combine the letter and number to form the series value
    return letter + number;
}

describe('Puppeteer evaluation ammount of references gets incresed', () => {
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

    /**
     * Has 4 extra cells at A25-D25
     */
    it('200 cells with no other functions and increasing %', async () => {
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

        for (let i = 1; i < 11; i++) {
            let initialFunctionTime = Date.now();

            let currentCell = await page1.$(`[id="A0"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.click('#functionInput', { clickCount: 3 });
            await page1.type('#functionInput', `=SUM(A1:D${i * 5})`);
            await page1.click('#functionInputButton');

            let textValue = await page1.$eval('#A0', (input) => input.value);
            expect(textValue).toBe('' + i * 100);

            let timeToFunction = Date.now() - initialFunctionTime;

            console.log(
                `Time to ${2 * i + '' + 0} references : ${timeToFunction} ms`
            );
        }
    });

    /**
     * Has 4 extra cells at A25-D25
     */
    it('200 cells with 10% of cells being functions and increasing %', async () => {
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
        await page1.type('#B0', '1');
        await page1.type('#C0', '2');
        await page1.type('#D0', '2');
        for (let i = 0; i < 200; i++) {
            let currentCellId = getSeriesValue(i, ['A', 'B', 'C', 'D']);
            if (i % 10 === 0) {
                let currentCell = await page1.$(`[id="${currentCellId}"]`);
                await currentCell.evaluate((ele) => ele.click());
                await page1.type('#functionInput', `=SUM(B0:D0)`);
                await page1.click('#functionInputButton');
            } else {
                await page1.type('#' + currentCellId, '5');
            }
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);

        for (let i = 1; i < 11; i++) {
            let initialFunctionTime = Date.now();

            let currentCell = await page1.$(`[id="A0"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.click('#functionInput', { clickCount: 3 });
            await page1.type('#functionInput', `=SUM(A1:D${i * 5})`);
            await page1.click('#functionInputButton');

            let textValue = await page1.$eval('#A0', (input) => input.value);
            expect(textValue).toBe('' + i * 100);

            let timeToFunction = Date.now() - initialFunctionTime;

            console.log(
                `Time to ${2 * i + '' + 0} references : ${timeToFunction} ms`
            );
        }
    });

    /**
     * Has 4 extra cells at A25-D25
     *
     */
    it('200 cells with 20% of cells being functions and increasing %', async () => {
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
        await page1.type('#B0', '1');
        await page1.type('#C0', '2');
        await page1.type('#D0', '2');
        for (let i = 0; i < 200; i++) {
            let currentCellId = getSeriesValue(i, ['A', 'B', 'C', 'D']);
            if (i % 5 == 0) {
                let currentCell = await page1.$(`[id="${currentCellId}"]`);
                await currentCell.evaluate((ele) => ele.click());
                await page1.type('#functionInput', `=SUM(B0:D0)`);
                await page1.click('#functionInputButton');
            } else {
                await page1.type('#' + currentCellId, '5');
            }
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);

        for (let i = 1; i < 11; i++) {
            let initialFunctionTime = Date.now();

            let currentCell = await page1.$(`[id="A0"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.click('#functionInput', { clickCount: 3 });
            await page1.type('#functionInput', `=SUM(A1:D${i * 5})`);
            await page1.click('#functionInputButton');

            let textValue = await page1.$eval('#A0', (input) => input.value);
            expect(textValue).toBe('' + i * 100);
            let timeToFunction = Date.now() - initialFunctionTime;

            console.log(
                `Time to ${2 * i + '' + 0} references : ${timeToFunction} ms`
            );
        }
    });

    /**
     * Has the functions distributed evenly until 180
     */
    it('200 cells with 30% of cells being functions and increasing %', async () => {
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
        await page1.type('#B0', '1');
        await page1.type('#C0', '2');
        await page1.type('#D0', '2');
        for (let i = 0; i < 200; i++) {
            let currentCellId = getSeriesValue(i, ['A', 'B', 'C', 'D']);
            if (i % 3 == 0 && i < 181) {
                let currentCell = await page1.$(`[id="${currentCellId}"]`);
                await currentCell.evaluate((ele) => ele.click());
                await page1.type('#functionInput', `=SUM(B0:D0)`);
                await page1.click('#functionInputButton');
            } else {
                await page1.type('#' + currentCellId, '5');
            }
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);

        for (let i = 1; i < 11; i++) {
            let initialFunctionTime = Date.now();

            let currentCell = await page1.$(`[id="A0"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.click('#functionInput', { clickCount: 3 });
            await page1.type('#functionInput', `=SUM(A1:D${i * 5})`);
            await page1.click('#functionInputButton');

            let textValue = await page1.$eval('#A0', (input) => input.value);
            expect(textValue).toBe('' + i * 100);

            let timeToFunction = Date.now() - initialFunctionTime;

            console.log(
                `Time to ${2 * i + '' + 0} references : ${timeToFunction} ms`
            );
        }
    });

    /**
     * Has the functions distributed evenly until 160
     */
    it('200 cells with 40% of cells being functions and increasing %', async () => {
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
        await page1.type('#B0', '1');
        await page1.type('#C0', '2');
        await page1.type('#D0', '2');
        for (let i = 0; i < 200; i++) {
            let currentCellId = getSeriesValue(i, ['A', 'B', 'C', 'D']);
            if (i % 2 == 0 && i < 161) {
                let currentCell = await page1.$(`[id="${currentCellId}"]`);
                await currentCell.evaluate((ele) => ele.click());
                await page1.type('#functionInput', `=SUM(B0:D0)`);
                await page1.click('#functionInputButton');
            } else {
                await page1.type('#' + currentCellId, '5');
            }
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);

        for (let i = 1; i < 11; i++) {
            let initialFunctionTime = Date.now();

            let currentCell = await page1.$(`[id="A0"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.click('#functionInput', { clickCount: 3 });
            await page1.type('#functionInput', `=SUM(A1:D${i * 5})`);
            await page1.click('#functionInputButton');

            let textValue = await page1.$eval('#A0', (input) => input.value);
            expect(textValue).toBe('' + i * 100);
            let timeToFunction = Date.now() - initialFunctionTime;

            console.log(
                `Time to ${2 * i + '' + 0} references : ${timeToFunction} ms`
            );
        }
    });

    it('200 cells with 50% of cells being functions and increasing %', async () => {
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
        await page1.type('#B0', '1');
        await page1.type('#C0', '2');
        await page1.type('#D0', '2');
        for (let i = 0; i < 200; i++) {
            let currentCellId = getSeriesValue(i, ['A', 'B', 'C', 'D']);
            if (i % 2 == 0) {
                let currentCell = await page1.$(`[id="${currentCellId}"]`);
                await currentCell.evaluate((ele) => ele.click());
                await page1.type('#functionInput', `=SUM(B0:D0)`);
                await page1.click('#functionInputButton');
            } else {
                await page1.type('#' + currentCellId, '5');
            }
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);

        for (let i = 1; i < 11; i++) {
            let initialFunctionTime = Date.now();

            let currentCell = await page1.$(`[id="A0"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.click('#functionInput', { clickCount: 3 });
            await page1.type('#functionInput', `=SUM(A1:D${i * 5})`);
            await page1.click('#functionInputButton');

            let textValue = await page1.$eval('#A0', (input) => input.value);
            expect(textValue).toBe('' + i * 100);

            let timeToFunction = Date.now() - initialFunctionTime;

            console.log(
                `Time to ${2 * i + '' + 0} references : ${timeToFunction} ms`
            );
        }
    });

    /**
     * Has the functions distributed evenly until 160
     */
    it('200 cells with 60% of cells being functions and increasing %', async () => {
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
        await page1.type('#B0', '1');
        await page1.type('#C0', '2');
        await page1.type('#D0', '2');
        for (let i = 0; i < 200; i++) {
            let currentCellId = getSeriesValue(i, ['A', 'B', 'C', 'D']);
            if (i % 2 == 0 && i < 161) {
                await page1.type('#' + currentCellId, '5');
            } else {
                let currentCell = await page1.$(`[id="${currentCellId}"]`);
                await currentCell.evaluate((ele) => ele.click());
                await page1.type('#functionInput', `=SUM(B0:D0)`);
                await page1.click('#functionInputButton');
            }
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);

        for (let i = 1; i < 11; i++) {
            let initialFunctionTime = Date.now();

            let currentCell = await page1.$(`[id="A0"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.click('#functionInput', { clickCount: 3 });
            await page1.type('#functionInput', `=SUM(A1:D${i * 5})`);
            await page1.click('#functionInputButton');
            let textValue = await page1.$eval('#A0', (input) => input.value);
            expect(textValue).toBe('' + i * 100);

            let timeToFunction = Date.now() - initialFunctionTime;

            console.log(
                `Time to ${2 * i + '' + 0} references : ${timeToFunction} ms`
            );
        }
    });

    /**
     * Has the functions distributed evenly until 180
     */
    it('200 cells with 70% of cells being functions and increasing %', async () => {
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
        await page1.type('#B0', '1');
        await page1.type('#C0', '2');
        await page1.type('#D0', '2');
        for (let i = 0; i < 200; i++) {
            let currentCellId = getSeriesValue(i, ['A', 'B', 'C', 'D']);
            if (i % 3 == 0 && i < 181) {
                await page1.type('#' + currentCellId, '5');
            } else {
                let currentCell = await page1.$(`[id="${currentCellId}"]`);
                await currentCell.evaluate((ele) => ele.click());
                await page1.type('#functionInput', `=SUM(B0:D0)`);
                await page1.click('#functionInputButton');
            }
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);

        for (let i = 1; i < 11; i++) {
            let initialFunctionTime = Date.now();

            let currentCell = await page1.$(`[id="A0"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.click('#functionInput', { clickCount: 3 });
            await page1.type('#functionInput', `=SUM(A1:D${i * 5})`);
            await page1.click('#functionInputButton');
            let textValue = await page1.$eval('#A0', (input) => input.value);
            expect(textValue).toBe('' + i * 100);

            let timeToFunction = Date.now() - initialFunctionTime;

            console.log(
                `Time to ${2 * i + '' + 0} references : ${timeToFunction} ms`
            );
        }
    });

    it('200 cells with 80% of cells being functions and increasing %', async () => {
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
        await page1.type('#B0', '1');
        await page1.type('#C0', '2');
        await page1.type('#D0', '2');
        for (let i = 0; i < 200; i++) {
            let currentCellId = getSeriesValue(i, ['A', 'B', 'C', 'D']);
            if (i % 5 == 0) {
                await page1.type('#' + currentCellId, '5');
            } else {
                let currentCell = await page1.$(`[id="${currentCellId}"]`);
                await currentCell.evaluate((ele) => ele.click());
                await page1.type('#functionInput', `=SUM(B0:D0)`);
                await page1.click('#functionInputButton');
            }
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);

        for (let i = 1; i < 11; i++) {
            let initialFunctionTime = Date.now();

            let currentCell = await page1.$(`[id="A0"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.click('#functionInput', { clickCount: 3 });
            await page1.type('#functionInput', `=SUM(A1:D${i * 5})`);
            await page1.click('#functionInputButton');
            let textValue = await page1.$eval('#A0', (input) => input.value);
            expect(textValue).toBe('' + i * 100);

            let timeToFunction = Date.now() - initialFunctionTime;

            console.log(
                `Time to ${2 * i + '' + 0} references : ${timeToFunction} ms`
            );
        }
    });

    it('200 cells with 90% of cells being functions and increasing %', async () => {
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
        await page1.type('#B0', '1');
        await page1.type('#C0', '2');
        await page1.type('#D0', '2');
        for (let i = 0; i < 200; i++) {
            let currentCellId = getSeriesValue(i, ['A', 'B', 'C', 'D']);
            if (i % 10 == 0) {
                await page1.type('#' + currentCellId, '5');
            } else {
                let currentCell = await page1.$(`[id="${currentCellId}"]`);
                await currentCell.evaluate((ele) => ele.click());
                await page1.type('#functionInput', `=SUM(B0:D0)`);
                await page1.click('#functionInputButton');
            }
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);

        for (let i = 1; i < 11; i++) {
            let initialFunctionTime = Date.now();

            let currentCell = await page1.$(`[id="A0"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.click('#functionInput', { clickCount: 3 });
            await page1.type('#functionInput', `=SUM(A1:D${i * 5})`);
            await page1.click('#functionInputButton');

            let textValue = await page1.$eval('#A0', (input) => input.value);
            expect(textValue).toBe('' + i * 100);
            let timeToFunction = Date.now() - initialFunctionTime;

            console.log(
                `Time to ${2 * i + '' + 0} references : ${timeToFunction} ms`
            );
        }
    });

    it('200 cells with 100% of cells being functions and increasing %', async () => {
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
        await page1.type('#B0', '1');
        await page1.type('#C0', '2');
        await page1.type('#D0', '2');
        for (let i = 0; i < 200; i++) {
            let currentCellId = getSeriesValue(i, ['A', 'B', 'C', 'D']);

            let currentCell = await page1.$(`[id="${currentCellId}"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.type('#functionInput', `=SUM(B0:D0)`);
            await page1.click('#functionInputButton');
        }

        let timeToWrite = Date.now() - initialTime;
        console.log(`Time to WRITE: ${timeToWrite} ms`);

        for (let i = 1; i < 11; i++) {
            let initialFunctionTime = Date.now();

            let currentCell = await page1.$(`[id="A0"]`);
            await currentCell.evaluate((ele) => ele.click());
            await page1.click('#functionInput', { clickCount: 3 });
            await page1.type('#functionInput', `=SUM(A1:D${i * 5})`);
            await page1.click('#functionInputButton');

            let textValue = await page1.$eval('#A0', (input) => input.value);
            expect(textValue).toBe('' + i * 100);

            let timeToFunction = Date.now() - initialFunctionTime;

            console.log(
                `Time to ${2 * i + '' + 0} references : ${timeToFunction} ms`
            );
        }
    });
}, 3000000);
