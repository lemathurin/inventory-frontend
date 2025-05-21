// Import commands
import './commands';


// Global configuration for e2e tests
Cypress.on('uncaught:exception', (err) => {
  // Prevent non-critical errors from stopping tests
  console.error('Uncaught exception:', err);
  return false;
});