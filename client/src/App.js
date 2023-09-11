import React, { useState, useEffect, useContext } from 'react'; 
import Modal from 'react-modal';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat'; 
import UserContext from './UserContext';  
import ThemeContext from './ThemeContext'; 


function App() {
  const [user, setUser] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

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

  const customStyles = {
    overlay: {
      backgroundColor: theme === 'day' ? 'rgba(173, 216, 230, 0.75)' : 'rgba(48, 48, 48, 0.75)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      height: '300px',
      backgroundColor: theme === 'day' ? 'rgba(230, 230, 250, 1)' : 'rgba(69, 69, 69, 1)',
    },
  };

  return (
    <UserContext.Provider value={{ user, setUser }}> 
      <div style={{ 
        background: theme === 'day' ? 'linear-gradient(to right, #b3cde0, #6497b1)' : 'linear-gradient(to right, #3b3b3b, #0b0b0b)', 
        height: '100vh',
        color: theme === 'day' ? '#000' : '#c0c0c0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
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
          style={customStyles}
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
