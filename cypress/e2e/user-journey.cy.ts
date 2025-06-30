/// <reference path="../../node_modules/cypress/types/index.d.ts" />

describe('Base Test Scenario - Inventory App', () => {
  
  const timestamp = Date.now()
  
  interface TestUser {
    name: string
    email: string
    password: string
  }
  
  interface TestItem {
    name: string
    description: string
    price: string
    purchaseDate: string
  }
  
  const testData = {
    testUser: {
      name: "Cypress Test User",
      email: `cypress.test.${timestamp}@example.com`,
      password: "CypressTest123!"
    } as TestUser,
    
    testItem: {
      name: `Vacuum test ${timestamp}`,
      description: "Vacuum created by E2E automated test",
      price: "199.99",
      purchaseDate: "2024-01-15"
    } as TestItem
  }

  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('Complete base scenario', () => {
    
    // Create test home with invite code
    const homeOwner = {
      name: "Home Owner",
      email: `owner.${timestamp}@example.com`,
      password: "Owner123!"
    }
    
    cy.request('POST', `${Cypress.env('backendUrl')}/api/auth/register`, homeOwner)
      .then((registrationResponse) => {
        const ownerId = registrationResponse.body.id
        const token = registrationResponse.body.token
        
        if (!ownerId) {
          throw new Error('Could not find user ID in registration response: ' + JSON.stringify(registrationResponse.body))
        }
        
        return cy.request({
          method: 'POST',
          url: `${Cypress.env('backendUrl')}/api/homes`,
          body: {
            name: 'Test House for E2E',
            address: '123 Test Street',
            userId: ownerId
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then((homeResponse) => ({ homeResponse, token }))
      })
      .then(({ homeResponse, token }) => {
        const homeId = homeResponse.body.id || homeResponse.body.home?.id || homeResponse.body.data?.id
        
        if (!homeId) {
          throw new Error('Could not find home ID in creation response: ' + JSON.stringify(homeResponse.body))
        }
        
        cy.wrap(homeId).as('testHomeId')
        
        return cy.request({
          method: 'POST',
          url: `${Cypress.env('backendUrl')}/api/homes/${homeId}/invites`,
          body: {
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      })
      .then((response) => {
        const inviteCode = response.body.invite?.code
        
        if (!inviteCode) {
          throw new Error('Could not find invite code in response: ' + JSON.stringify(response.body))
        }
        
        cy.wrap(inviteCode).as('validInviteCode')
        return cy.wrap(inviteCode)
      })
      .then((inviteCode) => {
        
        // STEP 1: New user registration
        cy.visit('/signup')

        cy.get('input[name="name"]', { timeout: 10000 }).type(testData.testUser.name)
        cy.get('input[name="email"]').type(testData.testUser.email)
        cy.get('input[name="password"]').type(testData.testUser.password)

        cy.intercept('POST', '**/api/auth/register').as('registerAPI')
        cy.get('button[type="submit"]').contains('Sign Up').click()

        cy.wait('@registerAPI', { timeout: 10000 }).then((interception) => {
          expect(interception.response?.statusCode).to.be.oneOf([200, 201])
        })
        
        cy.url().should('include', '/onboarding/start')

        // STEP 2: Login with created credentials
        cy.visit('/login')
        
        cy.get('input[name="email"]').type(testData.testUser.email)
        cy.get('input[name="password"]').type(testData.testUser.password)
        
        cy.intercept('POST', '**/api/auth/login').as('loginAPI')
        cy.get('button[type="submit"]').contains('Login').click()
        
        cy.wait('@loginAPI').then((interception) => {
          expect(interception.response?.statusCode).to.be.oneOf([200, 304])
          cy.url().should('include', '/onboarding/start')
        })

        // STEP 3: Join existing house via invitation code
        cy.contains('Getting started').should('be.visible')
        cy.contains('Join an existing home').click()
        cy.url().should('include', '/onboarding/join')
        
        cy.get('input[name="inviteCode"]').type(inviteCode as string)
        
        cy.intercept('POST', '**/api/homes/invites/accept').as('joinHouseAPI')
        cy.get('button[type="submit"]').contains('Join').click()
        
        cy.wait('@joinHouseAPI').then((interception) => {
          expect(interception.response?.statusCode).to.be.oneOf([200, 304])
          
          const homeId = interception.response?.body?.home?.id || interception.response?.body?.homeId
          if (homeId) {
            cy.wrap(homeId).as('currentHomeId')
            cy.visit(`/home/${homeId}`)
            cy.url().should('include', `/home/${homeId}`)
          }
        })

        // STEP 4: View house items list
        cy.get('@currentHomeId').then((homeId) => {
          cy.intercept('GET', `**/api/items/home/${homeId}*`).as('getItemsAPI')
          cy.reload()
          
          cy.wait('@getItemsAPI').then((interception) => {
            const status = interception.response?.statusCode
            if (![200, 304].includes(status || 0)) {
              cy.log(`Items API returned: ${status}`)
            }
          })
        })
        
        cy.contains('Newest items').should('be.visible')
        
        cy.get('body').then(($body) => {
          const itemCount = $body.find('a[href*="/item/"]').length
          if (itemCount > 0) {
            cy.log(`Found ${itemCount} existing items`)
          }
        })

        // Create room for item organization (optional step)
        cy.get('@currentHomeId').then((homeId) => {
          cy.request({
            method: 'POST',
            url: `${Cypress.env('backendUrl')}/api/rooms/${homeId}/room`,
            body: { name: 'E2E Test Room' },
            failOnStatusCode: false
          }).then((roomResponse) => {
            if ([200, 201].includes(roomResponse.status)) {
              const roomId = roomResponse.body.id || roomResponse.body.data?.id
              cy.wrap(roomId).as('testRoomId')
              cy.visit(`/home/${homeId}`)
              cy.contains('Newest items', { timeout: 10000 }).should('be.visible')
              return cy.wrap(roomId)
            } else {
              cy.wrap(null).as('testRoomId')
              return cy.wrap(null)
            }
          })
        })

        // STEP 5: Create new item
        cy.get('@currentHomeId').then((homeId) => {
          cy.intercept('GET', `**/api/items/home/${homeId}*`).as('getItemsAPI2')
          
          cy.visit(`/home/${homeId}`)
          cy.url().should('include', `/home/${homeId}`)
          
          cy.wait('@getItemsAPI2').then((interception) => {
            const status = interception.response?.statusCode
            if (![200, 304].includes(status || 0)) {
              cy.log(`Items API: ${status}`)
            }
          })
        })

        cy.get('header, [data-testid="app-header"], nav').should('be.visible')
        cy.contains('button, a', 'Create item').should('be.visible').click()

        cy.url().should('include', '/create-item')
        cy.contains('Create New Item').should('be.visible')

        // Fill item creation form
        cy.get('form').should('be.visible')
        cy.get('input[placeholder="Enter item name"]').should('be.visible')

        cy.get('input[placeholder="Enter item name"]').type(testData.testItem.name)
        cy.get('textarea[placeholder="Enter description or notes"]').type(testData.testItem.description)
        cy.get('input[placeholder="0.00"]').type(testData.testItem.price)

        cy.get('button').contains('dd/mm/yyyy').click()
        cy.get('[role="gridcell"]').contains('15').click()

        // Select room if available
        cy.get('body').then(($body) => {
          if ($body.find('button[role="combobox"]').length >= 2) {
            cy.get('button[role="combobox"]').contains('Select room').parent().click()
            
            cy.get('[data-radix-select-content], [role="listbox"]', { timeout: 10000 })
              .should('be.visible')

            cy.get('[role="option"]').should('have.length.gte', 1).then(($options) => {
              if ($options.length > 0) {
                cy.wrap($options.first()).click()
              }
            })
          }
        })

        // Select visibility
        cy.contains('label', 'Visibility').parent().within(() => {
          cy.get('button[role="combobox"]').click()
        })
        cy.get('[data-radix-select-content], [role="listbox"]').should('be.visible')
        cy.get('[role="option"]').contains('Public').click()

        // Submit form
        cy.get('@currentHomeId').then((homeId) => {
          cy.intercept('POST', `**/api/items/${homeId}/item`).as('createItemAPI')
          
          cy.get('button[type="submit"]').contains('Create Item').click()
          
          cy.wait('@createItemAPI', { timeout: 15000 }).then((interception) => {
            expect(interception.response?.statusCode).to.eq(201)
            const itemId = interception.response?.body?.id
            cy.wrap(itemId).as('newItemId')
          })
        })

        // Verify item appears
        cy.url().should('include', `/home/`)
        cy.contains(testData.testItem.name, { timeout: 10000 }).should('be.visible')

        cy.get('body').then(($body) => {
          if (!$body.text().includes(testData.testItem.name)) {
            cy.reload()
            cy.contains(testData.testItem.name, { timeout: 15000 }).should('be.visible')
          }
        })

        // Create owner's item for multi-user testing
        const homeOwnerEmail = `owner.${timestamp}@example.com`
        cy.request('POST', `${Cypress.env('backendUrl')}/api/auth/login`, {
          email: homeOwnerEmail,
          password: "Owner123!"
        }).then((loginResponse) => {
          const ownerToken = loginResponse.body.token
          cy.wrap(ownerToken).as('ownerToken')
          
          cy.get('@currentHomeId').then((homeId) => {
            cy.get('@testRoomId').then((roomId) => {
              cy.request({
                method: 'POST',
                url: `${Cypress.env('backendUrl')}/api/items/${homeId}/item`,
                body: {
                  name: `Owner's Microwave ${timestamp}`,
                  roomId: roomId,
                  description: 'Microwave owned by the home owner',
                  public: true,
                  price: 299.99,
                  hasWarranty: false
                },
                headers: {
                  'Authorization': `Bearer ${ownerToken}`
                }
              }).then((itemResponse) => {
                expect(itemResponse.status).to.eq(201)
                const ownerItemId = itemResponse.body.id
                cy.wrap(ownerItemId).as('ownerItemId')
              })
            })
          })
        })

        // Refresh to see all items
        cy.get('@currentHomeId').then((homeId) => {
          cy.get('@testRoomId').then((roomId) => {
            if (roomId) {
              cy.intercept('GET', `**/api/items/room/${roomId}*`).as('getRoomItemsAPI')
              cy.visit(`/home/${homeId}/room/${roomId}`)
              
              cy.wait('@getRoomItemsAPI', { timeout: 10000 }).then((interception) => {
                const status = interception.response?.statusCode
                
                if (status === 200) {
                  const items = interception.response?.body || []
                  cy.log(`Found ${items.length} items in room`)
                } else if (status === 404) {
                  cy.visit(`/home/${homeId}`)
                  cy.contains('Newest items', { timeout: 10000 }).should('be.visible')
                }
              })
            } else {
              cy.visit(`/home/${homeId}`)
              cy.contains('Newest items', { timeout: 10000 }).should('be.visible')
            }
          })
        })

        // STEP 6: View another user's item
        cy.get('body').then(($body) => {
          const itemLinks = $body.find('a[href*="/item/"]')
          
          if (itemLinks.length < 2) {
            cy.get('@currentHomeId').then((homeId) => {
              cy.visit(`/home/${homeId}`)
              cy.contains('Newest items', { timeout: 10000 }).should('be.visible')
            })
          }
        })

        cy.get('a[href*="/item/"]', { timeout: 10000 }).should('have.length.gte', 1)

        // Find item from another user
        cy.get('a[href*="/item/"]').then(($links) => {
          let otherUserItemFound = false
          let targetItemId: string | null = null
          let targetLink: HTMLElement | null = null
          
          $links.each((index: number, link: HTMLElement) => {
            const linkText = Cypress.$(link).text()
            
            if (linkText.includes('Owner') && 
                !linkText.includes('Cypress Test User') && 
                !linkText.includes(testData.testUser.name)) {
              
              if (!otherUserItemFound) {
                const href = Cypress.$(link).attr('href')
                const itemId = href?.match(/\/item\/(\w+)/)?.[1]
                
                if (itemId) {
                  targetItemId = itemId
                  targetLink = link
                  otherUserItemFound = true
                }
              }
            }
          })
          
          if (!otherUserItemFound || !targetItemId || !targetLink) {
            throw new Error('No other user item found')
          }
          
          cy.wrap(targetItemId).as('otherItemId')
          cy.wrap(targetLink).click()
          cy.url().should('include', `/item/${targetItemId}`)
        })

        // Verify read-only access (no edit/delete buttons)
        cy.get('[data-testid="item-details"], main, .item-container').should('be.visible')
        cy.get('button').contains('Edit').should('not.exist')
        cy.get('button').contains('Delete').should('not.exist')

        // STEP 7: Attempt to modify another user's item (should fail)
        cy.get('@otherItemId').then((itemId) => {
          cy.request({
            method: 'PATCH',
            url: `${Cypress.env('backendUrl')}/api/items/${itemId}`,
            failOnStatusCode: false,
            body: { name: 'Unauthorized modification attempt' }
          }).then((response) => {
            expect(response.status).to.be.oneOf([403, 401])
          })
          
          cy.get('@currentHomeId').then((homeId) => {
            cy.visit(`/home/${homeId}/item/${itemId}/edit`, { failOnStatusCode: false })
            
            cy.get('body').then(($body) => {
              if ($body.text().includes('Edit') && $body.text().includes('Update Item')) {
                throw new Error('Edit page should not be accessible')
              }
            })
          })
        })

        // STEP 8: Logout
        cy.get('@currentHomeId').then((homeId) => {
          cy.visit(`/home/${homeId}`)
        })

        cy.contains('Newest items', { timeout: 10000 }).should('be.visible')

        cy.get('[data-sidebar="footer"] button').click()

        cy.intercept('POST', '**/api/auth/logout').as('logoutAPI')
        cy.contains('Log out').click()

        cy.wait('@logoutAPI').then((interception) => {
          expect(interception.response?.statusCode).to.be.oneOf([200, 204])
        })

        cy.url({ timeout: 10000 }).should('include', '/login')
      })
  })
})