
describe(' Iniciar Sesión  de usuario', () => {
  let username = 'test';
let password = 'test';
  beforeEach(() => {
    // Visita la página principal
    cy.visit('http://localhost:4200/');
  });

  it('Debería completar el formulario de  Iniciar Sesión ', () => {
 
    cy.get('input#mat-input-0').type(username);
    cy.get('input#mat-input-1').type(password, { force: true });
    // Haz clic en el botón de " Iniciar Sesión "
    cy.get('button').contains(' Iniciar Sesión ').click();
    cy.get('button.dropdown-btn').find('mat-icon').contains('account_circle').parent().click();
    cy.get('a').contains('Logout').click();


  });
});