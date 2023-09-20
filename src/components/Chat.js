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
    socket = io('https://videoplay-chat-app-38f126c44487.herokuapp.com/');
    
    socket.on('previous_messages', (messages) => {
      console.debug('Received previous messages', messages);
      setChat(messages);
    });
    
    socket.on('receive_message', (message) => {
      console.debug('Received new message', message);
      setChat((oldChat) => [...oldChat, message]);
    });
    
    socket.on('change_video', (videoID) => {
      console.debug('Video ID changed', videoID);
      setVideoID(videoID);
      setYoutubeURL('');
    });
    
    return () => {
      console.debug('Socket disconnected');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  const sendMessage = () => {
    if (message) {
      if (user) {
        const newMessage = { username: user.username, message, colorClass };
        socket.emit('send_message', newMessage);
        console.debug('Message sent', newMessage);
        setMessage('');
      } else {
        console.error('User not authenticated');
        alert('You must be logged in to send a message');
      }
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
      if(videoID) {
        setVideoID(videoID);
        socket.emit('change_video', videoID);
        console.debug('Video changed', videoID);
      } else {
        throw new Error('Invalid YouTube URL');
      }
    } catch (e) {
      console.error(e.message);
      alert('Invalid YouTube URL, please check and try again.');
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
            <div key={`${msg.username}-${index}`} className={`chat-message ${msg.colorClass}`}>
              <b>{msg.username}</b>
              {msg.message}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-container">
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
    </div>
  );  
}

export default Chat;
