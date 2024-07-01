import puppeteer from 'puppeteer';

import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';

describe('Puppeteer concurrency tests', () => {
    let browser;
    let page1;
    let page2;
    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: 'new' });
        page1 = await browser.newPage();
        await page1.goto('http://localhost:5173');
        page2 = await browser.newPage();
        await page2.goto('http://localhost:5174');
    });

    beforeEach(async () => {
        await page1.waitForSelector('#clearButton');
        const button = await page1.$('[id="clearButton"]');
        await button.evaluate((ele) => ele.click());

        await page1.evaluate(() => {
            window.scrollTo(0, 0);
        });
        await page2.evaluate(() => {
            window.scrollTo(0, 0);
        });
        await page2.bringToFront();
    });

    afterAll(async () => {
        await browser.close();
    });

    it('Unconnected clients do not see changes', async () => {
        await page2.click('#connectionButton');

        await page1.waitForSelector('#A0');
        await page1.type('#A0', '5');
        await page1.waitForSelector('#A1');

        await page1.type('#A1', '6');
        const textvalue = await page2.$eval('#A0', (input) => input.value);
        expect(textvalue).toBe('');
        await page2.click('#connectionButton');
        const textValue2 = await page2.$eval('#A0', (input) => input.value);
        expect(textValue2).toBe('5');
    });

    it('Conflict resolution works as expected', async () => {
        let connectionText = await page2.$eval(
            '#connectionButton',
            (ele) => ele.textContent
        );
        console.log(connectionText);
        await page2.click('#connectionButton');

        //console.log('cCCOANSJJSA');
        console.log(connectionText);
        await page1.type('#C1', 'Hello');
        await page1.type('#C0', '');

        await page1.waitForSelector('#ColHeadB');
        await page1.bringToFront();

        await page1.click('#ColHeadB', { button: 'right' });
        await page1.click('#column');

        let page1Check = await page1.$eval('#B1', (input) => input.value);
        expect(page1Check).toBe('Hello');

        await page2.bringToFront();
        await page2.waitForSelector('#B1');
        await page2.type('#B1', 'test');
        await page2.type('#B2', '');
        let page2Check = await page2.$eval('#B1', (input) => input.value);

        expect(page2Check).toBe('test');

        await page2.click('#connectionButton');

        await page1.waitForSelector('#B1');

        page1Check = await page1.$eval('#C1', (input) => input.value);
        expect(page1Check).toBe('Hello');

        page1Check = await page1.$eval('#B1', (input) => input.value);
        expect(page1Check).toBe('test');
    });

    it('Functions work correctly', async () => {
        await page2.click('#connectionButton');
        const a0 = await page1.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page1.type('#functionInput', '=SUM(A1;A2)');
        const functionInputButton = await page1.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());
        //await page1.click('#functionInputButton');
        let textValue = await page1.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('0');

        await page1.type('#A1', '5');
        await page1.type('#A2', '4');
        await page1.type('#B1', '');

        textValue = await page1.$eval('#A0', (input) => input.value);
        expect(textValue).toBe('9');

        let textValue2 = await page2.$eval('#A0', (input) => input.value);
        expect(textValue2).toBe('');

        await page2.click('#connectionButton');
        textValue2 = await page2.$eval('#A0', (input) => input.value);
        expect(textValue2).toBe('9');
    });

    it('Range gets updated correctly with col deletion', async () => {
        await page1.type('#A1', '1');
        await page1.type('#A2', '2');
        await page1.type('#B1', '3');
        await page1.type('#B2', '4');
        await page1.type('#C1', '5');
        await page1.type('#C2', '6');
        await page1.type('#C0', '');

        await page2.click('#connectionButton');
        const a0 = await page1.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page1.type('#functionInput', '=SUM(A1:C2)');
        const functionInputButton = await page1.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('21');

        await page2.click('#ColHeadB', { button: 'right' });
        await page2.click('#column');
        await page2.click('#connectionButton');

        let page2Check = await page2.$eval('#A0', (input) => input.value);
        expect(page2Check).toBe('14');

        page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('14');
    });

    it('Range gets updated correctly with row deletion', async () => {
        await page2.click('#RowHead2', { button: 'right' });
        await page2.click('#below');

        await page1.type('#A1', '1');
        await page1.type('#A2', '2');
        await page1.type('#A3', '7');
        await page1.type('#B1', '3');
        await page1.type('#B2', '4');
        await page1.type('#B3', '8');

        await page1.type('#C1', '5');
        await page1.type('#C2', '6');
        await page1.type('#C3', '9');
        await page1.type('#C0', '');
        await page2.click('#connectionButton');
        const a0 = await page1.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page1.type('#functionInput', '=SUM(A1:C3)');
        const functionInputButton = await page1.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('45');

        await page2.click('#RowHead2', { button: 'right' });
        await page2.click('#row');
        await page2.click('#connectionButton');

        let page2Check = await page2.$eval('#A0', (input) => input.value);
        expect(page2Check).toBe('33');

        page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('33');
    });

    it('Deleting start of range ref', async () => {
        await page1.type('#A1', '1');
        await page1.type('#A2', '2');
        await page1.type('#B1', '3');
        await page1.type('#B2', '4');
        await page1.type('#C1', '5');
        await page1.type('#C2', '6');
        await page1.type('#C0', '');

        await page2.click('#connectionButton');
        const a0 = await page1.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page1.type('#functionInput', '=SUM(A1:C2)');
        const functionInputButton = await page1.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('21');

        await page2.click('#RowHead1', { button: 'right' });
        await page2.click('#row');
        await page2.click('#connectionButton');

        let page2Check = await page2.$eval('#A0', (input) => input.value);
        expect(page2Check).toBe('#REF');

        page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('#REF');
    });

    it('Deleting end of range ref', async () => {
        await page1.type('#A1', '1');
        await page1.type('#A2', '2');
        await page1.type('#B1', '3');
        await page1.type('#B2', '4');
        await page1.type('#C1', '5');
        await page1.type('#C2', '6');
        await page1.type('#C0', '');

        await page2.click('#connectionButton');
        const a0 = await page1.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page1.type('#functionInput', '=SUM(A1:C2)');
        const functionInputButton = await page1.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('21');

        await page2.click('#RowHead2', { button: 'right' });
        await page2.click('#row');
        await page2.click('#connectionButton');

        let page2Check = await page2.$eval('#A0', (input) => input.value);
        expect(page2Check).toBe('#REF');

        page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('#REF');
    });

    it('Deleting referenced cell from a multireference function', async () => {
        await page1.type('#A1', '2');
        await page1.type('#A2', '4');
        await page1.type('#C0', '');

        await page2.click('#connectionButton');
        const a0 = await page1.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page1.type('#functionInput', '=DIV(A2;A1)');
        const functionInputButton = await page1.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('2');

        await page2.click('#RowHead1', { button: 'right' });
        await page2.click('#row');
        await page2.click('#connectionButton');

        let page2Check = await page2.$eval('#A0', (input) => input.value);
        expect(page2Check).toBe('#REF');

        page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('#REF');
    });

    it('Deleting referenced cell from a singlereference function', async () => {
        await page1.type('#A1', '4');
        await page1.type('#C0', '');

        await page2.click('#connectionButton');
        const a0 = await page1.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page1.type('#functionInput', '=SQRT(A1)');
        const functionInputButton = await page1.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('2');

        await page2.click('#RowHead1', { button: 'right' });
        await page2.click('#row');
        await page2.click('#connectionButton');

        let page2Check = await page2.$eval('#A0', (input) => input.value);
        expect(page2Check).toBe('#REF');

        page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('#REF');
    });

    it('Insertion of row in range reference updates function correctly', async () => {
        await page1.type('#A1', '1');
        await page1.type('#A2', '2');
        await page1.type('#B1', '3');
        await page1.type('#B2', '4');
        await page1.type('#C1', '5');
        await page1.type('#C2', '6');
        await page1.type('#C0', '');

        await page2.click('#connectionButton');
        const a0 = await page1.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page1.type('#functionInput', '=SUM(A1:C2)');
        const functionInputButton = await page1.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('21');

        await page2.click('#RowHead1', { button: 'right' });
        await page2.click('#below');
        await page2.type('#A2', '10');

        await page2.click('#connectionButton');

        let page2Check = await page2.$eval('#A0', (input) => input.value);
        expect(page2Check).toBe('31');

        page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('31');
    });

    it('Functions update correctly after concurrent edit', async () => {
        await page1.bringToFront();
        await page1.type('#A1', '1');
        await page1.type('#A2', '2');
        await page1.type('#B1', '3');
        await page1.type('#B2', '4');
        await page1.type('#C1', '5');
        await page1.type('#C2', '6');
        await page1.type('#C0', '');

        const a0 = await page1.$('[id="A0"]');
        await a0.evaluate((ele) => ele.click());
        await page1.type('#functionInput', '=SUM(A1:C2)');
        let functionInputButton = await page1.$('[id="functionInputButton"]');
        await functionInputButton.evaluate((ele) => ele.click());

        let page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('21');

        await page2.bringToFront();
        await page2.click('#connectionButton');

        await page2.click('#A2', { clickCount: 3 });
        await page2.type('#A2', '32');
        await page2.type('#C0', '');

        let page2Check = await page2.$eval('#A0', (input) => input.value);
        expect(page2Check).toBe('51');

        page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('21');

        await page2.click('#connectionButton');
        await page1.bringToFront();
        page1Check = await page1.$eval('#A0', (input) => input.value);
        expect(page1Check).toBe('51');
    });
}, 20000);
