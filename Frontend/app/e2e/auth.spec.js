describe('Authentication (UI)', () => {
  it('logs in via login form and redirects to dashboard', () => {
    cy.visit('/login');

    cy.get('[data-cy=email]').type('e2e@test.de');
    cy.get('[data-cy=password]').type('Secret1234!');

    cy.contains('button', 'Login').click();

    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.contains('Users').should('be.visible');
  });
});