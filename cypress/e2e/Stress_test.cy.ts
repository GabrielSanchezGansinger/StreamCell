describe('StressTests', () => {
    before(() => {
        cy.visit('/');
    });
    it('Function with 1 reference', () => {
        cy.get('#clearButton').click();
        cy.get('#A1').clear().type('1');
        cy.get('#A0').click();
        cy.get('#functionInput').clear().type('=SUM(A1)');
        cy.get('#functionInputButton').click();
        cy.get('#A0').should('have.value', 1);
    });

    it('Function with 2 references', () => {
        cy.get('#A2').clear().type('1');
        cy.get('#B0').click();
        cy.get('#functionInput').clear().type('=SUM(A1;A2)');
        cy.get('#functionInputButton').click();
        cy.get('#B0').should('have.value', 2);
    });

    it('Function with 5 references', () => {
        let currentRow = 2;
        for (let i = 0; i < 3; i++) {
            cy.get('#RowHead2').rightclick();
            cy.get('#below').click();
            cy.get('#A3').type('1');
            currentRow++;
        }
        cy.get('#C0').click();
        cy.get('#functionInput')
            .clear()
            .type('=SUM(A1:A' + currentRow + ')');
        cy.get('#functionInputButton').click();
        cy.get('#C0').should('have.value', 5);
    });

    it('Function with 10 references', () => {
        cy.get('#ColHeadA').rightclick();
        cy.get('#right').click();
        for (let i = 1; i < 6; i++) {
            cy.get('#B' + i).type('1');
        }
        cy.get('#B0').click();
        cy.get('#functionInput').clear().type('=SUM(A1:B5)');
        cy.get('#functionInputButton').click();
        cy.get('#B0').should('have.value', 10);
    });

    it('Function with 20 references', () => {
        let currentRow = 5;
        for (currentRow; currentRow < 10; currentRow++) {
            cy.get('#RowHead5').rightclick();
            cy.get('#below').click();
            cy.get('#A6').type('1');
            cy.get('#B6').type('1');
        }
        cy.get('#A0').click();
        cy.get('#functionInput')
            .clear()
            .type('=SUM(A1:B' + currentRow + ')');
        cy.get('#functionInputButton').click();
        cy.get('#A0').should('have.value', 20);
    });

    it('Function with 50 references', () => {
        let currentRow = 10;
        for (currentRow; currentRow < 25; currentRow++) {
            cy.get('#RowHead5').rightclick();
            cy.get('#below').click();
            cy.get('#A6').type('1');
            cy.get('#B6').type('1');
        }
        cy.get('#A0').click();
        cy.get('#functionInput')
            .clear()
            .type('=SUM(A1:B' + currentRow + ')');
        cy.get('#functionInputButton').click();
        cy.get('#A0').should('have.value', 50);
    });

    it('Function with 100 references', () => {
        cy.get('#ColHeadA').rightclick();
        cy.get('#right').click();
        cy.get('#ColHeadA').rightclick();
        cy.get('#right').click();
        for (let i = 1; i < 26; i++) {
            cy.get('#B' + i).type('1');
            cy.get('#C' + i).type('1');
        }
        cy.get('#B0').click();
        cy.get('#functionInput').clear().type('=SUM(A1:D25)');
        cy.get('#functionInputButton').click();
        cy.get('#B0').should('have.value', 100);
    });

    it('Function with 200 references', () => {
        let currentRow = 25;
        for (currentRow; currentRow < 50; currentRow++) {
            cy.get('#RowHead25').rightclick();
            cy.get('#below').click();
            cy.get('#A26').type('1');
            cy.get('#B26').type('1');
            cy.get('#C26').type('1');
            cy.get('#D26').type('1');
        }
        cy.get('#A0').click();
        cy.get('#functionInput')
            .clear()
            .type('=SUM(A1:D' + currentRow + ')');
        cy.get('#functionInputButton').click();
        cy.get('#A0').should('have.value', 200);
    });

    it('Function with 500 references', () => {
        let currentRow = 50;
        for (currentRow; currentRow < 125; currentRow++) {
            cy.get('#RowHead50').rightclick();
            cy.get('#below').click();
            cy.get('#A51').type('1');
            cy.get('#B51').type('1');
            cy.get('#C51').type('1');
            cy.get('#D51').type('1');
        }
        cy.get('#A0').click();
        cy.get('#functionInput')
            .clear()
            .type('=SUM(A1:D' + currentRow + ')');
        cy.get('#functionInputButton').click();
        cy.get('#A0').should('have.value', 500);
    });

    it('Function with 1000 references', () => {
        cy.get('#ColHeadA').rightclick();
        cy.get('#right').click();
        cy.get('#ColHeadA').rightclick();
        cy.get('#right').click();
        cy.get('#ColHeadA').rightclick();
        cy.get('#right').click();
        cy.get('#ColHeadA').rightclick();
        cy.get('#right').click();
        for (let i = 1; i < 126; i++) {
            cy.get('#B' + i).type('1');
            cy.get('#C' + i).type('1');
            cy.get('#D' + i).type('1');
            cy.get('#E' + i).type('1');
        }
        cy.get('#B0').click();
        cy.get('#functionInput').clear().type('=SUM(A1:H125)');
        cy.get('#functionInputButton').click();
        cy.get('#B0').should('have.value', 1000);
    });

    it('Lets make 125 functions and see if it breaks', () => {
        let currentRow = 1;
        for (currentRow; currentRow < 126; currentRow++) {
            cy.get('#I' + currentRow).click();

            cy.get('#functionInput')
                .clear()
                .type('=SUM(A' + currentRow + ':H' + currentRow + ')');
            cy.get('#functionInputButton').click();
        }
    });
});
