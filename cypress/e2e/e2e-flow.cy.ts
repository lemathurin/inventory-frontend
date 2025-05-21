describe('Complete user journey', () => {
  it('should complete the full user flow from registration to logout', () => {
    // Load all necessary fixtures
    cy.fixture('user').then((user) => {
      cy.fixture('invitation').then((invitation) => {
        cy.fixture('item').then((item) => {

          // 1. Register a new user
          cy.registerUser(user.email, user.password, user.username);

          // 2. Log in with the newly created credentials
          cy.loginUser(user.email, user.password);

          // 3. Join an existing home using an invitation code
          cy.joinHouse(invitation.code);

          // 4. View the list of items in the home
          cy.contains('Item list').should('exist'); // Adapt to your actual UI

          // 5. Create a new item
          cy.createItem(item);
          cy.contains(item.name).should('exist');

          // 6. View an item created by another user
          cy.visit(`/items/${item.otherUserItemId}`);
          cy.contains('Details').should('exist'); // Adapt to actual UI

          // 7. Try to edit another user's item (should be disabled or forbidden)
          cy.get('[data-testid="edit-item-button"]').should('be.disabled');

          // 8. Logout
          cy.logout();
          cy.url().should('include', '/login');
        });
      });
    });
  });
});
