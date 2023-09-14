import React, { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../UserContext'; 
import ThemeContext from '../ThemeContext'; 

function Login({ setIsLoginModalOpen }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const { user, setUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);  

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/login', { username, password });
      setMessage(res.data.message);
      
      if (res.data.message === "Logged in successfully") {
        const userData = { username };
        setUser(userData);  
        localStorage.setItem('user', JSON.stringify(userData));  
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");  
    }
  };

  const themeStyles = {
    color: theme === 'day' ? '#000' : '#c0c0c0',
    backgroundColor: theme === 'day' ? '#fff' : '#2f2f2f',
    transition: 'all 0.5s',
  };

  return (
    <div style={{...themeStyles, background: 'linear-gradient(to right, #1e3c72, #2a5298)', borderRadius: '15px', padding: '20px'}}>
      <h2 style={{ marginBottom: '16px', color: 'white' }}>Login</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          style={{ ...themeStyles, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          style={{ ...themeStyles, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={login} style={{ ...themeStyles, padding: '10px 20px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#ffae19' }}>Login</button>
      </div>
      <p style={{ marginTop: '16px' }}>{message}</p>
      <button onClick={() => setIsLoginModalOpen(false)} style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px', borderRadius: '12px', border: 'none', background: '#fff' }}>Close</button>
    </div>
  );
}

export default Login;
