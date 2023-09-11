import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import UserContext from '../UserContext';
import YouTube from 'react-youtube';
import './Chat.css';

let socket;

function Chat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [youtubeURL, setYoutubeURL] = useState('');
  const [videoID, setVideoID] = useState('M7lc1UVf-VE');
  const { user } = useContext(UserContext);
  const messagesEndRef = useRef(null);

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
      const newMessage = { username: user.username, message };
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

  return (
    <div className="chat-container">
      <div className="video-player">
        <div className="youtube-container">
          <YouTube 
            videoId={videoID} 
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 1,
              },
            }}
          />
        </div>
        {user ? (
          <div className="video-url-input">
            <input
              type="text"
              value={youtubeURL}
              onChange={(e) => setYoutubeURL(e.target.value)}
              placeholder="Enter YouTube URL"
            />
            <button onClick={handleVideoChange}>Change Video</button>
          </div>
        ) : (
          <p>You can share YouTube videos once logged in.</p>
        )}
      </div>
      
      <div className="chat-section">
        <div className="chat-messages">
          {chat.map((msg, index) => (
            <div key={index} className="chat-message">
              <b>{msg.username}</b>
              <p>{msg.message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="chat-input"
        />
        <button onClick={sendMessage} className="chat-send-button">Send</button>
        {!user && <p style={{ color: 'red' }}>Please log in to join the chat.</p>}
      </div>
    </div>
  );
}

export default Chat;
