import React from 'react';

function Message({ username, content, isOwnMessage }) {
  return (
    <div style={{ 
      backgroundColor: isOwnMessage ? '#e6ffe6' : '#f0f0f0',
      margin: '5px',
      padding: '10px',
      borderRadius: '5px',
      textAlign: isOwnMessage ? 'right' : 'left',
    }}>
      <strong>{username}</strong>: {content}
    </div>
  );
}

export default Message;
