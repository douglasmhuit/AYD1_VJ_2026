import { useState, useEffect } from 'react';
import userApi from '../api/userApi';

const UserDetails = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await userApi.getUserById(userId);
        setUser(data);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Usuario no encontrado');
        } else {
          setError('Error al cargar el usuario');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span className="loading-text">Cargando detalles...</span>
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

  if (!user) return null;

  return (
    <div className="user-details fade-in">
      <div className="user-details-header">
        <h2>
          <span>👤</span>
          Detalles del Usuario
        </h2>
      </div>
      <div className="details-content">
        <div className="details-item">
          <span className="label">ID</span>
          <span className="value"><code style={{ background: 'var(--gray-200)', padding: '2px 10px', borderRadius: '4px' }}>#{user.id}</code></span>
        </div>
        <div className="details-item">
          <span className="label">Nombre</span>
          <span className="value"><strong>{user.name}</strong></span>
        </div>
        <div className="details-item">
          <span className="label">Email</span>
          <span className="value email-value">{user.email}</span>
        </div>
        <div className="details-item">
          <span className="label">Edad</span>
          <span className="value">
            {user.age ? (
              <span className="age-value">{user.age} años</span>
            ) : (
              'No especificada'
            )}
          </span>
        </div>
        <div className="details-item">
          <span className="label">Fecha de creación</span>
          <span className="value">
            {new Date(user.created_at).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
      <button className="btn-close" onClick={onClose} style={{ width: '100%' }}>
        Cerrar
      </button>
    </div>
  );
};

export default UserDetails;