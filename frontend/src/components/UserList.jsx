import { useState, useEffect } from 'react';
import userApi from '../api/userApi';

const UserList = ({ onEdit, onDelete, onView }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span className="loading-text">Cargando usuarios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <span className="error-icon">⚠️</span>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="user-list fade-in">
      <div className="user-list-header">
        <h2>
          Usuarios
          <span className="count-badge">{users.length}</span>
        </h2>
      </div>
      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3>No hay usuarios registrados</h3>
          <p style={{ color: 'var(--gray-400)' }}>Comienza creando tu primer usuario</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Edad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><code style={{ background: 'var(--gray-100)', padding: '2px 8px', borderRadius: '4px', fontSize: '13px' }}>#{user.id}</code></td>
                <td><strong>{user.name}</strong></td>
                <td style={{ color: 'var(--primary)' }}>{user.email}</td>
                <td>
                  <span className={`age-badge ${user.age ? 'has-age' : ''}`}>
                    {user.age || 'N/A'}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button 
                      className="btn-action btn-view"
                      onClick={() => onView(user)}
                      title="Ver detalles"
                    >
                      👁️ Ver
                    </button>
                    <button 
                      className="btn-action btn-edit"
                      onClick={() => onEdit(user)}
                      title="Editar"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="btn-action btn-delete"
                      onClick={() => onDelete(user.id)}
                      title="Eliminar"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;