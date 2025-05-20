// cypress.config.ts - For Cypress 10+

import { defineConfig } from 'cypress';
import { resetDatabase } from './cypress/support/db-setup';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // Configure tasks
      on('task', {
        async resetDB() {
          await resetDatabase();
          return null;
        },
      });
      
      return config;
    },
  },
  screenshotOnRunFailure: true,
  viewportWidth: 1280,
  viewportHeight: 720,
});