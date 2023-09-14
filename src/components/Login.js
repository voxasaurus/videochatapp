import React, { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../UserContext'; 
import ThemeContext from '../ThemeContext'; 

function Login({ setIsLoginModalOpen }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  
  const { setUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const login = async () => {
    try {
      const res = await axios.post('https://videochatapp-re9k.vercel.app/api/login', credentials, { withCredentials: true });
      setMessage(res.data.message);
      
      if (res.data.message === "Logged in successfully") {
        setUser({ username: credentials.username });  
        localStorage.setItem('user', JSON.stringify({ username: credentials.username }));  
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
          name="username"
          type="text" 
          placeholder="Username" 
          value={credentials.username}
          onChange={handleInputChange} 
          style={{ ...themeStyles, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input 
          name="password"
          type="password" 
          placeholder="Password"
          value={credentials.password}
          onChange={handleInputChange} 
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
