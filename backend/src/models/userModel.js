const db = require('../config/database');

class UserModel {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.query(query);
  }

  static async create(user) {
    const { name, email, age } = user;
    const query = `
      INSERT INTO users (name, email, age)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(query, [name, email, age]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM users ORDER BY id';
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, userData) {
    const { name, email, age } = userData;
    const query = `
      UPDATE users 
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          age = COALESCE($3, age)
      WHERE id = $4
      RETURNING *
    `;
    const result = await db.query(query, [name, email, age, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = UserModel;