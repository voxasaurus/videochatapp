import React, { useState, useEffect } from 'react'; // Added useEffect import here
import Modal from 'react-modal';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat'; 
import UserContext from './UserContext';  

function App() {
  const [user, setUser] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Define custom styles for the modal
  const customStyles = {
    overlay: {
      backgroundColor: 'grey',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      width: '400px',  // Set width
      height: '300px',  // Set height
    },
  };

  return (
    <UserContext.Provider value={{ user, setUser }}> 
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid gray', alignItems: 'center' }}>
          <Login />
          {!user ? (
            <button onClick={() => setIsRegisterModalOpen(true)} style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '1rem', borderRadius: '4px' }}>Register</button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px' }}>Logged in as: {user.username}</span>
              <button onClick={handleLogout} style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '1rem', borderRadius: '4px' }}>Logout</button>
            </div>
          )}
        </div>

        <Modal
          isOpen={isRegisterModalOpen}
          onRequestClose={() => setIsRegisterModalOpen(false)}
          contentLabel="Register Modal"
          style={customStyles}  // Apply the custom styles here
        >
          <Register />
          <button onClick={() => setIsRegisterModalOpen(false)} style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}>Close</button>
        </Modal>
        
        <Chat /> 
      </div>
    </UserContext.Provider>
  );
}

export default App;
