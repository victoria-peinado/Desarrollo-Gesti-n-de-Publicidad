let username = 'test';
let password = 'test';
describe('Registro de usuario', () => {
  beforeEach(() => {
    // Visita la página principal
    cy.visit('http://localhost:4200/');
  });

  it('Debería completar el formulario de registro', () => {
    // Haz clic en el botón que muestra el formulario de registro
    cy.get('#sign-up-btn').click();
    cy.get('input#mat-input-2').type(username);
    cy.get('input#mat-input-3').should('be.visible').and('not.be.disabled').type(password);


  });
});