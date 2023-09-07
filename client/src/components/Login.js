import React, { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../UserContext';  // Import UserContext

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const { setUser } = useContext(UserContext);  // Access setUser function from context

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/login', { username, password });
      setMessage(res.data.message);
      
      // If login is successful, update the user context with the username
      if (res.data.message === "Logged in successfully") {
        setUser({ username });  // Set the username in the user context
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");  // Handle potential undefined values gracefully
    }
  };

  return (
    <div>
      <h2>Login to Chat and Post Videos</h2>
      <input 
        type="text" 
        placeholder="Username" 
        value={username}
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={login}>Login</button>
      <p>{message}</p>
    </div>
  );
}

export default Login;
