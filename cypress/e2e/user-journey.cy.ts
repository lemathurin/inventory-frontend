/// <reference path="../../node_modules/cypress/types/index.d.ts" />

describe("Base Test Scenario - Inventory App", () => {
  const timestamp = Date.now();

  interface TestUser {
    name: string;
    email: string;
    password: string;
  }

  interface TestItem {
    name: string;
    description: string;
    price: string;
    purchaseDate: string;
  }

  const testData = {
    testUser: {
      name: "Mathurin",
      email: `mathurin.${timestamp}@example.com`,
      password: "MathurinTest123!",
    } as TestUser,

    testItem: {
      name: `MacBook Pro M3 ${timestamp}`,
      description:
        "Ordinateur Apple MacBook Pro 14 pouces acheté pour le travail",
      price: "2499.99",
      purchaseDate: "2024-01-01",
    } as TestItem,
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("Complete base scenario", () => {
    const homeOwner = {
      name: "Pierre",
      email: `pierre.${timestamp}@example.com`,
      password: "PierreOwner123!",
    };

    // Create home owner and setup home with invite code
    cy.request("POST", `${Cypress.env("backendUrl")}/api/auth/register`, homeOwner)
      .then((registrationResponse) => {
        const ownerId = registrationResponse.body.id;
        
        if (!ownerId) {
          throw new Error("Could not find user ID in registration response: " + JSON.stringify(registrationResponse.body));
        }

        cy.wrap(ownerId).as("homeOwnerId");

        return cy.request({
          method: "POST",
          url: `${Cypress.env("backendUrl")}/api/auth/login`,
          body: {
            email: homeOwner.email,
            password: homeOwner.password,
          },
        });
      })
      .then(() => {
        return cy.get("@homeOwnerId").then((ownerId) => {
          return cy.request({
            method: "POST",
            url: `${Cypress.env("backendUrl")}/api/homes`,
            body: {
              name: "Maison Familiale Pierre",
              address: "45 Rue de la Paix, Paris",
              userId: ownerId,
            },
          });
        });
      })
      .then((homeResponse) => {
        const homeId = homeResponse.body.id || homeResponse.body.home?.id || homeResponse.body.data?.id;

        if (!homeId) {
          throw new Error("Could not find home ID in creation response: " + JSON.stringify(homeResponse.body));
        }

        cy.wrap(homeId).as("testHomeId");

        return cy.request({
          method: "POST",
          url: `${Cypress.env("backendUrl")}/api/homes/${homeId}/invites`,
          body: {
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
        });
      })
      .then((response) => {
        const inviteCode = response.body.invite?.code;

        if (!inviteCode) {
          throw new Error("Could not find invite code in response: " + JSON.stringify(response.body));
        }

        cy.wrap(inviteCode).as("validInviteCode");

        // Clear cookies before new user registration
        cy.clearCookies();
        
        return cy.wrap(inviteCode);
      })
      .then((inviteCode) => {
        // New user registration
        cy.visit("/signup");

        cy.contains("Sign Up", { timeout: 10000 }).should("be.visible");
        cy.get("form", { timeout: 10000 }).should("be.visible");

        cy.get('input[type="text"]', { timeout: 10000 })
          .should("be.visible")
          .type(testData.testUser.name);
        cy.get('input[type="email"]', { timeout: 10000 })
          .should("be.visible")
          .type(testData.testUser.email);
        cy.get('input[type="password"]', { timeout: 10000 })
          .should("be.visible")
          .type(testData.testUser.password);

        cy.intercept("POST", "**/api/auth/register").as("registerAPI");
        cy.get('button[type="submit"]').contains("Sign Up").click();

        cy.wait("@registerAPI", { timeout: 10000 }).then((interception) => {
          expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
          const userId = interception.response?.body?.id;
          cy.wrap(userId).as("testUserId");
        });

        // Verify automatic redirect to onboarding
        cy.url().should("include", "/onboarding/start");
        cy.contains("Getting started").should("be.visible");

        // Join existing house via invitation code
        cy.get("button, a").contains("Join an existing home").click();
        cy.url().should("include", "/onboarding/join");

        cy.get('input[name="inviteCode"]').type(inviteCode as string);

        cy.intercept("POST", "**/api/homes/invites/accept").as("joinHouseAPI");
        cy.get('button[type="submit"]').contains("Join").click();

        cy.wait("@joinHouseAPI").then((interception) => {
          expect(interception.response?.statusCode).to.be.oneOf([200, 304]);

          const homeId = interception.response?.body?.home?.id || interception.response?.body?.homeId;
          if (homeId) {
            cy.wrap(homeId).as("currentHomeId");
            cy.visit(`/home/${homeId}`);
            cy.url().should("include", `/home/${homeId}`);
          }
        });

        // View house items list
        cy.get("@currentHomeId").then((homeId) => {
          cy.intercept("GET", `**/api/items/home/${homeId}*`).as("getItemsAPI");
          cy.reload();

          cy.wait("@getItemsAPI").then((interception) => {
            const status = interception.response?.statusCode;
            if (![200, 304].includes(status || 0)) {
              cy.log(`Items API returned: ${status}`);
            }
          });
        });

        cy.contains("Newest items").should("be.visible");

        // Create room for item organization
        cy.get("@currentHomeId").then((homeId) => {
          cy.request({
            method: "POST",
            url: `${Cypress.env("backendUrl")}/api/rooms/${homeId}/room`,
            body: { name: "Salon Principal" },
            failOnStatusCode: false,
          }).then((roomResponse) => {
            if ([200, 201].includes(roomResponse.status)) {
              const roomId = roomResponse.body.id || roomResponse.body.data?.id;
              cy.wrap(roomId).as("testRoomId");
              return cy.wrap(roomId);
            } else {
              cy.wrap(null).as("testRoomId");
              return cy.wrap(null);
            }
          });
        });

        // Create new item
        cy.get("@currentHomeId").then((homeId) => {
          cy.visit(`/home/${homeId}`);
          cy.url().should("include", `/home/${homeId}`);
        });

        cy.get('header, [data-testid="app-header"], nav').should("be.visible");
        cy.contains("button, a", "Create item").should("be.visible").click();

        cy.url({ timeout: 10000 }).should("include", "/create-item");
        cy.contains("Create New Item").should("be.visible");

        cy.get("form").should("be.visible");
        cy.get('input[placeholder="Enter item name"]').should("be.visible");

        cy.get('input[placeholder="Enter item name"]').type(testData.testItem.name);
        cy.get('textarea[placeholder="Enter description or notes"]').type(testData.testItem.description);
        cy.get('input[placeholder="0.00"]').type(testData.testItem.price);

        cy.get("button").contains("dd/mm/yyyy").click();
        cy.get('[role="gridcell"]:not([disabled])').first().click();

        // Select room if available
        cy.get("body").then(($body) => {
          if ($body.find('button[role="combobox"]').length >= 2) {
            cy.get('button[role="combobox"]').contains("Select room").parent().click();
            cy.get('[data-radix-select-content], [role="listbox"]', { timeout: 10000 }).should("be.visible");
            cy.get('[role="option"]').should("have.length.gte", 1).then(($options) => {
              if ($options.length > 0) {
                cy.wrap($options.first()).click();
              }
            });
          }
        });

        // Select visibility
        cy.contains("label", "Visibility").parent().within(() => {
          cy.get('button[role="combobox"]').click();
        });
        cy.get('[data-radix-select-content], [role="listbox"]').should("be.visible");
        cy.get('[role="option"]').contains("Public").click();

        // Submit form
        cy.get("@currentHomeId").then((homeId) => {
          cy.intercept("POST", `**/api/items/${homeId}/item`).as("createItemAPI");

          cy.get('button[type="submit"]').contains("Create Item").click();

          cy.wait("@createItemAPI", { timeout: 15000 }).then((interception) => {
            expect(interception.response?.statusCode).to.eq(201);
            const itemId = interception.response?.body?.id;
            cy.wrap(itemId).as("newItemId");
          });
        });

        // Verify item appears in home
        cy.url().should("include", `/home/`);
        cy.contains(testData.testItem.name, { timeout: 10000 }).should("be.visible");

        // Create owner's item for multi-user testing
        cy.clearCookies();
        
        cy.request({
          method: "POST",
          url: `${Cypress.env("backendUrl")}/api/auth/login`,
          body: {
            email: homeOwner.email,
            password: homeOwner.password,
          },
        }).then(() => {
          cy.get("@currentHomeId").then((homeId) => {
            cy.get("@testRoomId").then((roomId) => {
              cy.request({
                method: "POST",
                url: `${Cypress.env("backendUrl")}/api/items/${homeId}/item`,
                body: {
                  name: `Réfrigérateur Samsung ${timestamp}`,
                  roomId: roomId,
                  description: "Réfrigérateur américain 600L avec distributeur d'eau",
                  public: true,
                  price: 1899.99,
                  hasWarranty: true,
                },
              }).then((itemResponse) => {
                expect(itemResponse.status).to.eq(201);
                const ownerItemId = itemResponse.body.id;
                cy.wrap(ownerItemId).as("ownerItemId");
              });
            });
          });
        });

        // Switch back to test user
        cy.clearCookies();
        cy.request({
          method: "POST",
          url: `${Cypress.env("backendUrl")}/api/auth/login`,
          body: {
            email: testData.testUser.email,
            password: testData.testUser.password,
          },
        });

        // View all items in home
        cy.get("@currentHomeId").then((homeId) => {
          cy.visit(`/home/${homeId}`);
          cy.contains("Newest items", { timeout: 10000 }).should("be.visible");
        });

        cy.get('a[href*="/item/"]', { timeout: 10000 }).should("have.length.gte", 1);

        // View another user's item
        cy.get("@ownerItemId").then((ownerItemId) => {
          // Mock permissions endpoint for items user is not member of
          cy.intercept("GET", `**/api/items/*/permissions`, (req) => {
            if (req.url.includes(ownerItemId as string)) {
              req.reply({ statusCode: 403, body: { error: "You do not have permission to view this item's permissions" } });
            } else {
              req.reply({ statusCode: 200, body: { admin: true } });
            }
          }).as("mockPermissions");

          cy.get(`a[href*="/item/${ownerItemId}"]`).should("exist").then(($link) => {
            cy.wrap($link).click();
            cy.url({ timeout: 10000 }).should("match", /\/home\/[^\/]+\/item\/[^\/]+/);
            cy.wrap(ownerItemId).as("otherUserItemId");
          });
        });

        // Verify read-only access
        cy.get('[data-testid="item-details"], main, .item-container').should("be.visible");
        cy.get("button").contains("Edit item").should("not.exist");
        cy.get("button").contains("Delete").should("not.exist");

        cy.contains("Réfrigérateur Samsung").should("be.visible");
        cy.contains("Pierre").should("be.visible");

        // Attempt to modify another user's item (should fail)
        cy.get("@otherUserItemId").then((itemId) => {
          cy.request({
            method: "PATCH",
            url: `${Cypress.env("backendUrl")}/api/items/${itemId}`,
            failOnStatusCode: false,
            body: {
              name: "Tentative de modification non autorisée",
              description: "Cette modification ne devrait pas être possible",
            },
          }).then((response) => {
            expect(response.status).to.be.oneOf([403, 401, 422]);
            cy.log(`Modification correctly rejected with status: ${response.status}`);
          });
        });

        cy.get("@otherUserItemId").then((itemId) => {
          cy.get("@currentHomeId").then((homeId) => {
            cy.visit(`/home/${homeId}/item/${itemId}/edit`);

            cy.contains("You do not have permission to edit this item.", { timeout: 10000 }).should("be.visible");

            cy.get('input[placeholder="Enter item name"]').should("not.exist");
            cy.get("button").contains("Save Changes").should("not.exist");
          });

          cy.request({
            method: "DELETE",
            url: `${Cypress.env("backendUrl")}/api/items/${itemId}`,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.be.oneOf([403, 401, 422]);
            cy.log(`Deletion correctly rejected with status: ${response.status}`);
          });
        });

        // Logout
        cy.get("@currentHomeId").then((homeId) => {
          cy.visit(`/home/${homeId}`);
        });

        cy.contains("Newest items", { timeout: 10000 }).should("be.visible");

        cy.intercept("POST", "**/api/auth/logout").as("logoutAPI");

        cy.get('[data-sidebar="footer"] button').click();
        cy.contains("Log out").should("be.visible").click();

        cy.wait("@logoutAPI").then((interception) => {
          expect(interception.response?.statusCode).to.eq(200);
        });

        cy.url({ timeout: 10000 }).should("include", "/login");

        // Cleanup created data
        cy.clearCookies();

        // Delete owner's item to empty the room
        cy.request({
          method: "POST",
          url: `${Cypress.env("backendUrl")}/api/auth/login`,
          body: {
            email: homeOwner.email,
            password: homeOwner.password,
          },
          failOnStatusCode: false,
        }).then((response) => {
          if (response.status === 200) {
            cy.get("@ownerItemId").then((itemId) => {
              if (itemId) {
                cy.request({
                  method: "DELETE",
                  url: `${Cypress.env("backendUrl")}/api/items/${itemId}`,
                  failOnStatusCode: false,
                });
              }
            });
          }
        });

        cy.clearCookies();

        // Delete test user's item and room
        cy.request({
          method: "POST",
          url: `${Cypress.env("backendUrl")}/api/auth/login`,
          body: {
            email: testData.testUser.email,
            password: testData.testUser.password,
          },
          failOnStatusCode: false,
        }).then((response) => {
          if (response.status === 200) {
            cy.get("@newItemId").then((itemId) => {
              if (itemId) {
                cy.request({
                  method: "DELETE",
                  url: `${Cypress.env("backendUrl")}/api/items/${itemId}`,
                  failOnStatusCode: false,
                });
              }
            });

            cy.get("@testRoomId").then((roomId) => {
              if (roomId) {
                cy.request({
                  method: "DELETE",
                  url: `${Cypress.env("backendUrl")}/api/rooms/${roomId}`,
                  failOnStatusCode: false,
                });
              }
            });
          }
        });
      });
  });
});