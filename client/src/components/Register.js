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
      const res = await axios.post('https://videochatapp-re9k-nk9uz600w-voxasaurus.vercel.app/register', { username, password });
      setMessage(res.data.message);
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
      <h2 style={{ marginBottom: '16px', color: 'white' }}>Register</h2>
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
        <button onClick={register} style={{ ...themeStyles, padding: '10px 20px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#ffae19' }}>Register</button>
      </div>
      <p style={{ marginTop: '16px' }}>{message}</p>
    </div>
  );
}

export default Register;
