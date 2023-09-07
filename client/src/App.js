import React, { useState } from 'react';
import Modal from 'react-modal';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat'; 
import UserContext from './UserContext';  

function App() {
  const [user, setUser] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser }}> 
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid gray' }}>
          <Login />
          <button onClick={() => setIsRegisterModalOpen(true)} style={{ padding: '10px 20px', cursor: 'pointer' }}>Register</button>
        </div>

        <Modal
          isOpen={isRegisterModalOpen}
          onRequestClose={() => setIsRegisterModalOpen(false)}
          contentLabel="Register Modal"
          style={{ overlay: { backgroundColor: 'grey' } }}
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
