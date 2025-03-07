
describe('Registro de usuario', () => {
  let username = 'test';
let password = 'test';
  beforeEach(() => {
    // Visita la página principal
    cy.visit('http://localhost:4200/');
  });

  it('Debería completar el formulario de registro', () => {
    // Haz clic en el botón que muestra el formulario de registro
    cy.get('#sign-up-btn').click();
    cy.get('input#mat-input-2').type(username);
    cy.get('input#mat-input-3').type(password, { force: true });
    // Haz clic en el botón de "Registrarse"
    cy.get('button').contains('Registrarse').click();
    cy.get('button.dropdown-btn').find('mat-icon').contains('account_circle').parent().click();
    cy.get('a').contains('Logout').click();


  });
});