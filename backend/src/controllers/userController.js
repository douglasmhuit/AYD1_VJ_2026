const UserModel = require('../models/userModel');

class UserController {
  static async createUser(req, res) {
    try {
      const { name, email, age } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ 
          error: 'Name and email are required' 
        });
      }

      const user = await UserModel.create({ name, email, age });
      res.status(201).json(user);
    } catch (error) {
      if (error.constraint === 'users_email_key') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.update(id, req.body);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.delete(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;