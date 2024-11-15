// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Scene2 from './Scene2';
import './App.css';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

function WelcomePage({ setUserName, setDuration, setSelectedAudio }) {
  const navigate = useNavigate();

  const handleStartWorkout = () => {
    navigate('/Scene2'); // Navigate to Scene 2
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to VR ThreadFit</h1>
      <p>Immerse yourself in a virtual workout experience like no other.</p>
      <input 
        type="text" 
        placeholder="Enter your name" 
        onChange={(e) => setUserName(e.target.value)} 
      />
      <select onChange={(e) => setDuration(e.target.value)}>
        <option value="20">Beginner (20 min)</option>
        <option value="30">Intermediate (30 min)</option>
        <option value="45">Advanced (45 min)</option>
      </select>
     
      <button onClick={handleStartWorkout}>Start Your Journey</button>
    </div>
  );
}

function App() {
  const [userName, setUserName] = useState('');
  const [duration, setDuration] = useState('20');
 //const [selectedAudio, setSelectedAudio] = useState('/fitness.mp3'); // Default song

  // Effect to append the VR button
  useEffect(() => {
    const vrButton = VRButton.createButton();
    document.body.appendChild(vrButton);

    return () => {
      document.body.removeChild(vrButton);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <WelcomePage 
                setUserName={setUserName} 
                setDuration={setDuration} 
               // setSelectedAudio={setSelectedAudio} 
              />
            } 
          />
          <Route 
            path="/Scene2" 
            element={<Scene2 />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
