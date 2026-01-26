describe('Users page', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/users');
  });

  it('shows the users table', () => {
    cy.contains('Users').should('be.visible');
    cy.get('table').should('exist');
  });

  it('persists authentication after reload', () => {
    cy.reload();
    cy.contains('Users').should('be.visible');
  });

  it('hides admin actions for non-admin users', () => {
    cy.contains('Create User').should('not.exist');
    cy.contains('Export').should('not.exist');
    cy.contains('Block').should('not.exist');
  });
});
