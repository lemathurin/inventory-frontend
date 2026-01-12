describe("Login Page Smoke Test", () => {
  it("should load the login page and display the Login text", () => {
    cy.visit("/login");
    cy.contains("Login").should("be.visible");
  });
});
