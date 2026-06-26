import { useState } from 'react';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import UserDetails from '../components/UserDetails';
import userApi from '../api/userApi';

const UserManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => {
    setSelectedUser(null);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await userApi.deleteUser(id);
        setRefreshKey(prev => prev + 1);
      } catch (err) {
        alert('Error al eliminar el usuario');
        console.error(err);
      }
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedUser(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

  return (
    <div className="user-management">
      {!showForm && !showDetails && (
        <div style={{ marginBottom: '24px' }}>
          <button className="btn-primary" onClick={handleCreate}>
            ➕ Crear Nuevo Usuario
          </button>
        </div>
      )}

      {!showForm && !showDetails && (
        <UserList 
          key={refreshKey}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {showForm && (
        <UserForm
          user={selectedUser}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {showDetails && (
        <UserDetails
          userId={selectedUser?.id}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default UserManagement;