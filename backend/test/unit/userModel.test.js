jest.mock('../../src/config/database', () => ({
  query: jest.fn(),
  pool: { end: jest.fn() }
}));

const db = require('../../src/config/database');
const UserModel = require('../../src/models/userModel');

describe('UserModel - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  //201708975
  describe('create', () => {
    it('should create a new user successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      db.query.mockResolvedValue({ rows: [mockUser] });

      const result = await UserModel.create({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        ['John Doe', 'john@example.com', 30]
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle database errors', async () => {
      db.query.mockRejectedValue(new Error('Database error'));

      await expect(UserModel.create({
        name: 'John Doe',
        email: 'john@example.com'
      })).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' }
      ];

      db.query.mockResolvedValue({ rows: mockUsers });

      const result = await UserModel.findAll();

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users')
      );
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const mockUser = { id: 1, name: 'John', email: 'john@example.com' };

      db.query.mockResolvedValue({ rows: [mockUser] });

      const result = await UserModel.findById(1);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE id = $1'),
        [1]
      );
      expect(result).toEqual(mockUser);
    });

    it('should return undefined if user not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await UserModel.findById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updatedUser = { 
        id: 1, 
        name: 'John Updated', 
        email: 'john@example.com', 
        age: 31 
      };

      db.query.mockResolvedValue({ rows: [updatedUser] });

      const result = await UserModel.update(1, { name: 'John Updated', age: 31 });

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users'),
        ['John Updated', undefined, 31, 1]
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const deletedUser = { id: 1, name: 'John', email: 'john@example.com' };

      db.query.mockResolvedValue({ rows: [deletedUser] });

      const result = await UserModel.delete(1);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM users WHERE id = $1'),
        [1]
      );
      expect(result).toEqual(deletedUser);
    });
  });
});