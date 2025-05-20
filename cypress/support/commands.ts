// Type definitions for custom commands
declare namespace Cypress {
  interface Chainable {
    registerUser(email: string, password: string, username: string): Chainable<void>;
    loginUser(email: string, password: string): Chainable<void>;
    joinHouse(invitationCode: string): Chainable<void>;
    createItem(item: any): Chainable<void>;
    logout(): Chainable<void>;
  }
}

// Command for user registration
Cypress.Commands.add('registerUser', (email, password, username) => {
  cy.visit('/register');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="username-input"]').type(username);
  cy.get('[data-testid="register-button"]').click();
});

// Command for user login
Cypress.Commands.add('loginUser', (email, password) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

// Command to join a house with invitation code
Cypress.Commands.add('joinHouse', (invitationCode) => {
  cy.get('[data-testid="join-house-button"]').click();
  cy.get('[data-testid="invitation-code-input"]').type(invitationCode);
  cy.get('[data-testid="submit-invitation-code"]').click();
});

// Command to create a new item
Cypress.Commands.add('createItem', (item) => {
  cy.get('[data-testid="add-item-button"]').click();
  cy.get('[data-testid="item-name-input"]').type(item.name);
  cy.get('[data-testid="item-description-input"]').type(item.description);
  cy.get('[data-testid="item-purchase-date-input"]').type(item.purchaseDate);
  cy.get('[data-testid="item-price-input"]').type(item.price);
  cy.get('[data-testid="item-warranty-input"]').type(item.warranty);
  cy.get('[data-testid="save-item-button"]').click();
});

// Command for logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click();
});