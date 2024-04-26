import React, { useState } from 'react';
import './App.css';
import AudioPlayer from './AudioPlayer';

function App() {
  const [channelUrl, setChannelUrl] = useState('https://strcl-cdn.sr.se/lc/p4plus');

  const handleInputChange = (event) => {
    setChannelUrl(event.target.value);
  };

  return (
    <div className="App">
      <h1 className="title">Sveriges Radio</h1>
      <div className="channel-input-container">
        <label htmlFor="channelInput" className="channel-label">Enter Channel URL:</label>
        <input
          id="channelInput"
          type="text"
          value={channelUrl}
          onChange={handleInputChange}
          className="channel-input"
          placeholder="Enter channel URL..."
        />
      </div>
      <AudioPlayer src={channelUrl} />
    </div>
  );
}

export default App;
