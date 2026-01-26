Cypress.Commands.add('login', () => {
  cy.request('POST', 'http://localhost:3000/v1/auth/login', {
    email: 'e2e@test.de',
    password: 'Secret1234!',
  }).then((res) => {
    window.localStorage.setItem(
      'user',
      JSON.stringify({
        user: res.body.user,
        accessToken: res.body.accessToken,
      })
    );
  });
});
