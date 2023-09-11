import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import UserContext from '../UserContext';
import ThemeContext from '../ThemeContext';
import YouTube from 'react-youtube';
import './Chat.css';

let socket;

function Chat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [youtubeURL, setYoutubeURL] = useState('');
  const [videoID, setVideoID] = useState('M7lc1UVf-VE');
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const messagesEndRef = useRef(null);
  const [colorClass, setColorClass] = useState(`color${Math.floor(Math.random() * 10)}`);

  useEffect(() => {
    socket = io('http://localhost:5000');

    socket.on('previous_messages', (messages) => {
      setChat(messages);
    });

    socket.on('receive_message', (message) => {
      setChat((oldChat) => [...oldChat, message]);
    });

    socket.on('change_video', (videoID) => {
      setVideoID(videoID);
      setYoutubeURL('');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  const sendMessage = () => {
    if (message && user) {
      const newMessage = { username: user.username, message, colorClass };
      socket.emit('send_message', newMessage);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleVideoChange = () => {
    try {
      const videoID = new URL(youtubeURL).searchParams.get('v');
      setVideoID(videoID);
      socket.emit('change_video', videoID);
    } catch (e) {
      console.error('Invalid YouTube URL');
    }
  };

  const themeStyles = theme === 'day' ? { color: '#000' } : { color: '#c0c0c0' };

  return (
    <div className={`chat-container ${theme}`}>
      <div className="video-player">
        <div className="youtube-container">
          <YouTube videoId={videoID} />
        </div>
        <div className="video-url-input">
          <input type="text" value={youtubeURL} onChange={(e) => setYoutubeURL(e.target.value)} />
          <button onClick={handleVideoChange}>Change Video</button>
        </div>
      </div>
      <div className="chat-section">
        <div className="chat-messages" style={themeStyles}>
          {chat.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.colorClass}`}>
              <b>{msg.username}</b>
              {msg.message}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <input
          type="text"
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="chat-send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
