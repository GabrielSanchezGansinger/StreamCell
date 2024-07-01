describe('template spec', () => {
    it('passes', () => {
        cy.visit('/');
        cy.get('#clearButton').click();

        cy.get('#A1').clear().type('5');
        cy.get('#A2').clear().type(10);
        cy.get('#A0').click();
        cy.get('#functionInput').clear().type('=SUM(A1;A2)');
        cy.get('#functionInputButton').click();
        cy.get('#A0').should('have.value', 15);

        cy.get('#B1').clear().type(4.5);
        cy.get('#B2').clear().type(6);
        cy.get('#C1').clear().type(19);
        cy.get('#C2').clear().type(12);
        cy.get('#B0').click();
        cy.get('#functionInput').clear().type('=MAX(B1:C2)');
        cy.get('#functionInputButton').click();
        cy.get('#B0').should('have.value', 19);

        cy.get('#C0').click();
        cy.get('#functionInput').clear().type('=MULT(A1:C2)');
        cy.get('#functionInputButton').click();
        cy.get('#C0').should('have.value', 307800);

        //Insert new column on the right of B
        cy.get('#ColHeadB').rightclick();
        cy.get('#right').click();
        //Put value 2 in the new column
        cy.get('#C1').clear().type(2);
        cy.get('#D0').click();
        //Check if function was updated
        cy.get('#D0').should('have.value', 615600);
        //Delete new column C
        cy.get('#ColHeadC').rightclick();
        cy.get('#column').click();
        //Check if function was again updated
        cy.get('#C0').should('have.value', 307800);
    });
});
