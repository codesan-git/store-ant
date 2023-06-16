describe('Home Page Test', () => {

  beforeEach(() => {
    cy.visit('localhost:3000')
  });

  it('visits the home page', () => {
    // cy.screenshot(); //This actually screenshots the page and stores the result in the screenshot folder

  });

  it('contains a login and sign up button', () => {
    cy.contains('Masuk');
    cy.contains('Daftar');
  });

  it('contains a logo with the name "Store.ant"', () => {
    cy.contains('Store');
    cy.contains('.');
    cy.contains('ant');
  });

  it('should redirect to the login page when the user clicks on "Masuk"', () => {
    cy.contains('Masuk').click();

    cy.url().should('include', '/login')
  });
})