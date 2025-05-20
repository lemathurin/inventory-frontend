const { Client } = require('pg');

/**
 * Reset database to a known state before running E2E tests
 */
async function resetDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Reset tables
    await client.query(`
      TRUNCATE users, houses, house_members, items CASCADE;
    `);

    // Insert test data
    await client.query(`
      INSERT INTO users (id, email, password, username) 
      VALUES ('other-user-id', 'other@example.com', 'hashedpassword', 'otheruser');
    `);

    await client.query(`
      INSERT INTO houses (id, name, address, invitation_code)
      VALUES ('test-house-id', 'Test House', '123 Test Street', 'ABC123');
    `);

    // Insert a house member relationship
    await client.query(`
      INSERT INTO house_members (user_id, house_id)
      VALUES ('other-user-id', 'test-house-id');
    `);

    // Insert an item owned by the other user
    await client.query(`
      INSERT INTO items (id, name, description, purchase_date, price, warranty, user_id, house_id)
      VALUES (
        'other-item-id', 
        'Coffee Machine', 
        'Espresso machine', 
        '2023-01-15', 
        299.99, 
        12, 
        'other-user-id', 
        'test-house-id'
      );
    `);
  } finally {
    await client.end();
  }
}

module.exports = { resetDatabase };
