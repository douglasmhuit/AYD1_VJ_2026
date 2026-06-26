const request = require('supertest');
const app = require('../../src/app');
const UserModel = require('../../src/models/userModel');

describe('User API - Integration Tests', () => {

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.age).toBe(userData.age);
    });

    it('should return 400 when name is missing', async () => {
      const userData = {
        email: 'john@example.com',
        age: 30
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Name and email are required');
    });

    it('should return 409 when email already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      await request(app).post('/api/users').send(userData);
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(409);

      expect(response.body.error).toBe('Email already exists');
    });

  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const users = [
        { name: 'John', email: 'john@example.com', age: 30 },
        { name: 'Jane', email: 'jane@example.com', age: 25 }
      ];

      for (const user of users) {
        await UserModel.create(user);
      }

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('John');
      expect(response.body[1].name).toBe('Jane');
    });

    it('should return empty array when no users exist', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      const created = await UserModel.create({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });

      const response = await request(app)
        .get(`/api/users/${created.id}`)
        .expect(200);

      expect(response.body.id).toBe(created.id);
      expect(response.body.name).toBe('John Doe');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/999')
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user', async () => {
      const created = await UserModel.create({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });

      const updateData = {
        name: 'John Updated',
        age: 31
      };

      const response = await request(app)
        .put(`/api/users/${created.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe('John Updated');
      expect(response.body.age).toBe(31);
      expect(response.body.email).toBe('john@example.com');
    });

    it('should return 404 when updating non-existent user', async () => {
      const response = await request(app)
        .put('/api/users/999')
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user', async () => {
      const created = await UserModel.create({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });

      await request(app)
        .delete(`/api/users/${created.id}`)
        .expect(204);

      const user = await UserModel.findById(created.id);
      expect(user).toBeUndefined();
    });

    it('should return 404 when deleting non-existent user', async () => {
      await request(app)
        .delete('/api/users/999')
        .expect(404);
    });
  });
});