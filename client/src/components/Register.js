import React, { useState, useContext } from 'react';
import axios from 'axios';
import ThemeContext from '../ThemeContext';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const { theme } = useContext(ThemeContext);

  const register = async () => {
    try {
      const res = await axios.post('http://localhost:5000/register', { username, password });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");  // Handle potential undefined values gracefully
    }
  };

  const themeStyles = {
    color: theme === 'day' ? '#000' : '#c0c0c0',
    backgroundColor: theme === 'day' ? '#fff' : '#2f2f2f',
    transition: 'all 0.5s',
  };

  return (
    <div style={themeStyles}>
      <h2 style={{ marginBottom: '16px' }}>Register</h2>
      <input 
        type="text" 
        placeholder="Username" 
        value={username}
        onChange={(e) => setUsername(e.target.value)} 
        style={{ ...themeStyles, marginBottom: '8px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <input 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
        style={{ ...themeStyles, marginBottom: '8px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button onClick={register} style={{ ...themeStyles, padding: '10px 20px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}>Register</button>
      <p style={{ marginTop: '16px' }}>{message}</p>
    </div>
  );
}

export default Register;
