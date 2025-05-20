describe('Complete User Flow', () => {
  // Test variables to store test data
  const testUser = {
    email: `test-user-${Date.now()}@example.com`,
    password: 'Password123!',
    username: `testuser${Date.now()}`
  };
  const testObject = {
    name: 'Samsung TV',
    description: '55 inch 4K LED TV',
    purchaseDate: '2023-05-15',
    price: '599.99',
    warranty: '24'
  };
  let invitationCode = 'ABC123'; // Replace with a valid code or generate it
  let otherUserObjectId = '';    // Will be filled during the test

  beforeEach(() => {
    // Intercept HTTP requests to verify states and responses
    cy.intercept('POST', '**/api/auth/signup').as('signup');  // Changé de register à signup
    cy.intercept('POST', '**/api/auth/login').as('login');
    cy.intercept('GET', '**/api/houses').as('getHouses');
    cy.intercept('POST', '**/api/houses/join').as('joinHouse');
    cy.intercept('GET', '**/api/items*').as('getItems');
    cy.intercept('POST', '**/api/items').as('createItem');
    cy.intercept('PUT', '**/api/items/*').as('updateItem');
  });

  it('User journey from registration to logout', () => {
    // 1. Register a new user
    cy.visit('/signup');  // Changé de register à signup
    cy.get('[data-testid="email-input"]').type(testUser.email);
    cy.get('[data-testid="password-input"]').type(testUser.password);
    cy.get('[data-testid="name-input"]').type(testUser.username);
    cy.get('[data-testid="submit-button"]').click();  // Changé de register-button à signup-button
    cy.wait('@signup').its('response.statusCode').should('eq', 201);
    
    // 2. Login with created credentials
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(testUser.email);
    cy.get('[data-testid="password-input"]').type(testUser.password);
    cy.get('[data-testid="login-button"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/dashboard');  // Vérifiez si cette URL est correcte
    
    // 3. Join an existing house using an invitation code
    cy.get('[data-testid="join-house-button"]').click();
    cy.get('[data-testid="invitation-code-input"]').type(invitationCode);
    cy.get('[data-testid="submit-invitation-code"]').click();
    cy.wait('@joinHouse').its('response.statusCode').should('eq', 200);
    
    // 4. View the house items list
    cy.visit('/houses/items');  // Vérifiez si cette URL est correcte
    cy.wait('@getItems');
    cy.get('[data-testid="items-list"]').should('be.visible');
    
    // 5. Create a new item
    cy.get('[data-testid="add-item-button"]').click();
    cy.get('[data-testid="item-name-input"]').type(testObject.name);
    cy.get('[data-testid="item-description-input"]').type(testObject.description);
    cy.get('[data-testid="item-purchase-date-input"]').type(testObject.purchaseDate);
    cy.get('[data-testid="item-price-input"]').type(testObject.price);
    cy.get('[data-testid="item-warranty-input"]').type(testObject.warranty);
    cy.get('[data-testid="save-item-button"]').click();
    cy.wait('@createItem').its('response.statusCode').should('eq', 201);
    
    // 6. View an item belonging to another user
    cy.get('[data-testid="other-user-item"]').first().click();
    cy.url().should('include', '/items/');  // Vérifiez si cette URL est correcte
    cy.get('[data-testid="item-details"]').should('be.visible');
    
    // Store the item ID for the next test
    cy.url().then(url => {
      otherUserObjectId = url.split('/').pop() || '';
    });
    
    // 7. Attempt to modify another user's item (should fail)
    cy.get('[data-testid="edit-item-button"]').should('not.exist');
    
    // Try to modify directly via URL
    cy.visit(`/items/${otherUserObjectId}/edit`, { failOnStatusCode: false });  // Vérifiez si cette URL est correcte
    cy.get('[data-testid="error-message"]').should('be.visible');
    
    // 8. Logout
    cy.get('[data-testid="logout-button"]').click();
    cy.url().should('include', '/login');
  });
});