import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Scene2 from './Scene2'; // Import the Scene2 component
import './App.css'; // Import the CSS file
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

function WelcomePage({ setUserName, setDuration }) {
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

  // Effect to append the VR button
  useEffect(() => {
    const vrButton = VRButton.createButton();
    document.body.appendChild(vrButton); // Append the VR button to the document body

    return () => {
      document.body.removeChild(vrButton); // Cleanup to remove the button when the component unmounts
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={<WelcomePage setUserName={setUserName} setDuration={setDuration} />} 
          />
          <Route path="/Scene2" element={<Scene2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
