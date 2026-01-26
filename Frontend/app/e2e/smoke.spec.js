describe('Smoke tests', () => {
  it('loads the login page', () => {
    cy.visit('/login');
    cy.contains('Login').should('be.visible');
  });

  it('redirects unauthenticated users to login', () => {
    cy.clearLocalStorage();
    cy.visit('/users');
    cy.url().should('include', '/login');
  });
});
