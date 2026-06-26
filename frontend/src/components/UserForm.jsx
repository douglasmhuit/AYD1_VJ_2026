import { useState, useEffect } from 'react';
import userApi from '../api/userApi';

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        age: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        age: formData.age ? parseInt(formData.age) : undefined
      };

      let result;
      if (user) {
        result = await userApi.updateUser(user.id, dataToSend);
      } else {
        result = await userApi.createUser(dataToSend);
      }

      onSave(result);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('El email ya está registrado');
      } else if (err.response && err.response.status === 400) {
        setError(err.response.data.error || 'Datos inválidos');
      } else {
        setError('Error al guardar el usuario');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form fade-in">
      <div className="user-form-header">
        <h2>
          <span className="form-icon">{user ? '✏️' : '➕'}</span>
          {user ? 'Editar Usuario' : 'Crear Usuario'}
        </h2>
      </div>
      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Nombre completo <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: Juan Pérez"
          />
        </div>
        <div className="form-group">
          <label>
            Correo electrónico <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="ejemplo@correo.com"
          />
        </div>
        <div className="form-group">
          <label>Edad</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Ingresa tu edad"
            min="1"
            max="150"
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '3px' }}></span>
                Guardando...
              </>
            ) : (
              user ? 'Actualizar' : 'Crear'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;