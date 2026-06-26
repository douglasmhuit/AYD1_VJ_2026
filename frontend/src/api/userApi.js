import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const userApi = {
  // Obtener todos los usuarios
  getAllUsers: async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  // Crear usuario
  createUser: async (userData) => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },

  // Actualizar usuario
  updateUser: async (id, userData) => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  },

  // Eliminar usuario
  deleteUser: async (id) => {
    await axios.delete(`${API_URL}/users/${id}`);
  }
};

export default userApi;