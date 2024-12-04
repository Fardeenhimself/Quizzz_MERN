import { useState, useEffect } from 'react';
import Table from '../pages/components/Table';
import EditUserModal from '../pages/components/EditUserModal'; 
import Modal from '../pages/components/Modal';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); 

  useEffect(() => {
    fetch('http://localhost:8080/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, []);

  const handleAction = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  const confirmAction = () => {
    if (modalType === 'block') {
      console.log("Block user with ID:", selectedUser.id);
    } else if (modalType === 'delete') {
      console.log("Delete user with ID:", selectedUser.id);
    }
    closeModal();
  };

  const saveUser = (updatedUser) => {
    console.log("Updated user details:", updatedUser);
    closeModal();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={headerStyle}>User Management</h1>
        <Table 
          users={users}
          onEdit={(user) => handleAction('edit', user)}
          onBlock={(user) => handleAction('block', user)}
          onDelete={(user) => handleAction('delete', user)}
        />

        {modalType === 'edit' && (
          <EditUserModal
            isOpen={modalType === 'edit'}
            onClose={closeModal}
            onSave={saveUser}
            user={selectedUser}
          />
        )}

        {(modalType === 'block' || modalType === 'delete') && (
          <Modal
            isOpen={!!modalType}
            onClose={closeModal}
            onConfirm={confirmAction}
            title={modalType.charAt(0).toUpperCase() + modalType.slice(1) + ' User'}
          >
            <p>Are you sure you want to {modalType} this user?</p>
          </Modal>
        )}
      </div>
    </div>
  );
};

// styles
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '20px',
  boxSizing: 'border-box',
};

const contentStyle = {
  width: '100%',
  maxWidth: '1200px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '20px',
};

export default UserList;
