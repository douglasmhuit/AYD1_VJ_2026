require('dotenv').config({ path: '.env.test' });

const { pool } = require('../src/config/database');
const UserModel = require('../src/models/userModel');

beforeAll(async () => {
  await UserModel.createTable();
});

beforeEach(async () => {
  await pool.query('DELETE FROM users');
});

afterAll(async () => {
  try {
    await pool.end();
  } catch (err) {
    if (!err.message?.includes('Called end on pool more than once')) {
      console.error('Error closing pool:', err);
    }
  }
});