import puppeteer from 'puppeteer';

import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';

describe('StressTests', async () => {
    let browser;
    let page;
    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: 'new' });
        page = await browser.newPage();
        await page.goto('http://localhost:5173');
    });

    afterAll(async () => {
        await browser.close();
    });
    it('Function with 1 reference', async () => {
        await page.waitForSelector('#clearButton');
        const button = await page.$('[id="clearButton"]');
        await button.evaluate((ele) => ele.click());

        await page.waitForSelector('#A0');
        await page.type('#A1', '1');

        const a0 = await page.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page.type('#functionInput', '=SUM(A1)');
        const functionInputButton = await page.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let textValue = await page.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('1');
    });

    it('Function with 2 references', async () => {
        await page.type('#A2', '1');
        const a0 = await page.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page.click('#functionInput', { clickCount: 3 });
        await page.type('#functionInput', '=SUM(A1;A2)');
        const functionInputButton = await page.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let textValue = await page.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('2');
    });

    it('Function with 5 references', async () => {
        let currentRow = 2;
        for (let i = 0; i < 3; i++) {
            await page.click('#RowHead2', { button: 'right' });
            await page.click('#below');
            await page.type('#A3', '1');
            currentRow++;
        }

        const a0 = await page.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page.click('#functionInput', { clickCount: 3 });
        await page.type('#functionInput', '=SUM(A1:A' + currentRow + ')');
        const functionInputButton = await page.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let textValue = await page.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('5');
    });

    it('Function with 10 references', async () => {
        await page.click('#ColHeadA', { button: 'right' });
        await page.click('#right');

        for (let i = 1; i < 6; i++) {
            await page.type('#B' + i, '1');
        }

        const a0 = await page.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page.click('#functionInput', { clickCount: 3 });
        await page.type('#functionInput', '=SUM(A1:B5)');
        const functionInputButton = await page.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let textValue = await page.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('10');
    });

    it('Function with 20 references', async () => {
        let currentRow = 5;
        for (currentRow; currentRow < 10; currentRow++) {
            await page.click('#RowHead5', { button: 'right' });
            await page.click('#below');
            await page.type('#A6', '1');
            await page.type('#B6', '1');
        }
        const a0 = await page.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page.click('#functionInput', { clickCount: 3 });
        await page.type('#functionInput', '=SUM(A1:B' + currentRow + ')');
        const functionInputButton = await page.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let textValue = await page.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('20');
    });

    it('Function with 50 references', async () => {
        let currentRow = 10;
        for (currentRow; currentRow < 25; currentRow++) {
            await page.click('#RowHead10', { button: 'right' });
            await page.click('#below');
            await page.type('#A11', '1');
            await page.type('#B11', '1');
        }

        const a0 = await page.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page.click('#functionInput', { clickCount: 3 });
        await page.type('#functionInput', '=SUM(A1:B' + currentRow + ')');
        const functionInputButton = await page.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let textValue = await page.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('50');
    });

    it('Function with 100 references', async () => {
        await page.click('#ColHeadA', { button: 'right' });
        await page.click('#right');

        await page.click('#ColHeadA', { button: 'right' });
        await page.click('#right');

        for (let i = 1; i < 26; i++) {
            await page.type('#B' + i, '1');
            await page.type('#C' + i, '1');
        }

        const a0 = await page.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page.click('#functionInput', { clickCount: 3 });
        await page.type('#functionInput', '=SUM(A1:D25)');
        const functionInputButton = await page.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let textValue = await page.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('100');
    });

    it('Function with 200 references', async () => {
        let currentRow = 25;
        for (currentRow; currentRow < 50; currentRow++) {
            await page.click('#RowHead25', { button: 'right' });
            await page.click('#below');
            await page.type('#A26', '1');
            await page.type('#B26', '1');
            await page.type('#C26', '1');
            await page.type('#D26', '1');
        }

        const a0 = await page.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page.click('#functionInput', { clickCount: 3 });
        await page.type('#functionInput', '=SUM(A1:D' + currentRow + ')');
        const functionInputButton = await page.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let textValue = await page.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('200');
    });

    it('Function with 500 references', async () => {
        let currentRow = 50;
        for (currentRow; currentRow < 125; currentRow++) {
            await page.click('#RowHead50', { button: 'right' });
            await page.click('#below');
            await page.type('#A51', '1');
            await page.type('#B51', '1');
            await page.type('#C51', '1');
            await page.type('#D51', '1');
        }

        const a0 = await page.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page.click('#functionInput', { clickCount: 3 });
        await page.type('#functionInput', '=SUM(A1:D' + currentRow + ')');
        const functionInputButton = await page.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let textValue = await page.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('500');
    });

    it('Function with 1000 references', async () => {
        await page.click('#ColHeadA', { button: 'right' });
        await page.click('#right');
        await page.click('#ColHeadA', { button: 'right' });
        await page.click('#right');
        await page.click('#ColHeadA', { button: 'right' });
        await page.click('#right');
        await page.click('#ColHeadA', { button: 'right' });
        await page.click('#right');

        for (let i = 1; i < 126; i++) {
            await page.type('#B' + i, '1');
            await page.type('#C' + i, '1');
            await page.type('#D' + i, '1');
            await page.type('#E' + i, '1');
        }

        const a0 = await page.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page.click('#functionInput', { clickCount: 3 });
        await page.type('#functionInput', '=SUM(A1:H125)');
        const functionInputButton = await page.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let textValue = await page.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('1000');
    });

    it('2 functions', async () => {
        let currentRow = 1;
        for (currentRow; currentRow < 2; currentRow++) {
            const currentCell = await page.$('[id="J' + currentRow + '"]');
            await currentCell.evaluate((ele) => ele.click());
            await page.type(
                '#functionInput',
                '=SUM(A' + currentRow + ':H' + currentRow + ')'
            );
            const functionInputButton = await page.$(
                '[id="functionInputButton"]'
            );
            await functionInputButton.evaluate((ele) => ele.click());

            let textValue = await page.$eval(
                '#J' + currentRow,
                (input) => input.value
            );
            expect(textValue).toBe('8');
        }
    });
    it('5 functions', async () => {
        let currentRow = 2;
        for (currentRow; currentRow < 5; currentRow++) {
            const currentCell = await page.$('[id="J' + currentRow + '"]');
            await currentCell.evaluate((ele) => ele.click());
            await page.type(
                '#functionInput',
                '=SUM(A' + currentRow + ':H' + currentRow + ')'
            );
            const functionInputButton = await page.$(
                '[id="functionInputButton"]'
            );
            await functionInputButton.evaluate((ele) => ele.click());

            let textValue = await page.$eval(
                '#J' + currentRow,
                (input) => input.value
            );
            expect(textValue).toBe('8');
        }
    });
    it('10 functions', async () => {
        let currentRow = 5;
        for (currentRow; currentRow < 10; currentRow++) {
            const currentCell = await page.$('[id="J' + currentRow + '"]');
            await currentCell.evaluate((ele) => ele.click());
            await page.type(
                '#functionInput',
                '=SUM(A' + currentRow + ':H' + currentRow + ')'
            );
            const functionInputButton = await page.$(
                '[id="functionInputButton"]'
            );
            await functionInputButton.evaluate((ele) => ele.click());

            let textValue = await page.$eval(
                '#J' + currentRow,
                (input) => input.value
            );
            expect(textValue).toBe('8');
        }
    });
    it('20 functions', async () => {
        let currentRow = 10;
        for (currentRow; currentRow < 20; currentRow++) {
            const currentCell = await page.$('[id="J' + currentRow + '"]');
            await currentCell.evaluate((ele) => ele.click());
            await page.type(
                '#functionInput',
                '=SUM(A' + currentRow + ':H' + currentRow + ')'
            );
            const functionInputButton = await page.$(
                '[id="functionInputButton"]'
            );
            await functionInputButton.evaluate((ele) => ele.click());

            let textValue = await page.$eval(
                '#J' + currentRow,
                (input) => input.value
            );
            expect(textValue).toBe('8');
        }
    });
    it('50 functions', async () => {
        let currentRow = 20;
        for (currentRow; currentRow < 50; currentRow++) {
            const currentCell = await page.$('[id="J' + currentRow + '"]');
            await currentCell.evaluate((ele) => ele.click());
            await page.type(
                '#functionInput',
                '=SUM(A' + currentRow + ':H' + currentRow + ')'
            );
            const functionInputButton = await page.$(
                '[id="functionInputButton"]'
            );
            await functionInputButton.evaluate((ele) => ele.click());

            let textValue = await page.$eval(
                '#J' + currentRow,
                (input) => input.value
            );
            expect(textValue).toBe('8');
        }
    });
    it('100 functions', async () => {
        let currentRow = 50;
        for (currentRow; currentRow < 100; currentRow++) {
            const currentCell = await page.$('[id="J' + currentRow + '"]');
            await currentCell.evaluate((ele) => ele.click());
            await page.type(
                '#functionInput',
                '=SUM(A' + currentRow + ':H' + currentRow + ')'
            );
            const functionInputButton = await page.$(
                '[id="functionInputButton"]'
            );
            await functionInputButton.evaluate((ele) => ele.click());

            let textValue = await page.$eval(
                '#J' + currentRow,
                (input) => input.value
            );
            expect(textValue).toBe('8');
        }
    });
}, 160000);
