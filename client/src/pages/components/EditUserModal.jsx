import  { useState, useEffect } from 'react';

const EditUserModal = ({ isOpen, onClose, onSave, user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const handleSave = () => {
    onSave({ ...user, name, email, isAdmin });
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Edit User</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label>
          Admin:
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            style={checkboxStyle}
          />
        </label>
        <div style={buttonContainerStyle}>
          <button onClick={onClose} style={buttonStyle}>Cancel</button>
          <button onClick={handleSave} style={confirmButtonStyle}>Save</button>
        </div>
      </div>
    </div>
  );
};

// styles
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '8px',
  margin: '10px 0',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const checkboxStyle = {
  margin: '10px 0',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20px',
};

const buttonStyle = {
  backgroundColor: '#ddd',
  border: 'none',
  borderRadius: '4px',
  padding: '10px 20px',
  cursor: 'pointer',
};

const confirmButtonStyle = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '10px 20px',
  cursor: 'pointer',
};

export default EditUserModal;
