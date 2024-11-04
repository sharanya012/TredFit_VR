import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import './app1.css'; // Make sure to include this CSS file

const TreadmillModel = ({ positionZ, speed, isActive, updateDistance }) => {
    const treadmill = useLoader(GLTFLoader, '/models/scene2.glb');
    const ref = useRef();

    useEffect(() => {
        if (treadmill && treadmill.scene) {
            treadmill.scene.traverse((node) => {
                if (node.isMesh && node.material) {
                    node.material.roughness = 0.5;
                    node.material.metalness = 0.5;
                    node.material.needsUpdate = true;
                }
            });
        }
    }, [treadmill]);

    useFrame(() => {
        if (ref.current && isActive) {
            ref.current.position.z += speed; // Move the treadmill forward based on speed
            updateDistance(speed); // Update distance
            if (ref.current.position.z > 20) { // Reset position when out of view
                ref.current.position.z = positionZ; // Reset to initial position
            }
        }
    });

    return (
        <primitive
            ref={ref}
            object={treadmill.scene}
            scale={[0.2, 0.2, 0.2]}
            position={[5.5, -0.6, positionZ]}
        />
    );
};

const Lights = () => (
    <>
        <ambientLight intensity={0.5} />
        <hemisphereLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
    </>
);

const MetricsTab = ({ distance, calories, elapsedTime }) => (
    <div className="metrics-tab">
        <p>Kms Traveled: {(distance / 900).toFixed(2)} km</p>
        <p>Calories Burnt: {calories.toFixed(2)} kcal</p>
        <p>Elapsed Time: {elapsedTime} min</p>
    </div>
);

const SpeedControl = ({ speed, setSpeed }) => {
    const increaseSpeed = () => setSpeed((prev) => Math.min(prev + 0.001, 0.02)); // Cap max speed
    const decreaseSpeed = () => setSpeed((prev) => Math.max(prev - 0.001, 0)); // Min speed

    return (
        <div className="speed-control">
            <div className="circle">
                <div className="arrow" style={{ transform: `rotate(${(speed * 200)}deg)` }} />
            </div>
            <button onClick={increaseSpeed} className="speed-button">Increase Speed</button>
            <button onClick={decreaseSpeed} className="speed-button">Decrease Speed</button>
        </div>
    );
};

const StartStopButtons = ({ startActivity, stopActivity }) => (
    <div className="start-stop-buttons">
        <button onClick={startActivity} className="control-button">Start</button>
        <button onClick={stopActivity} className="control-button">Stop</button>
    </div>
);

const Scene = () => {
    const [distance, setDistance] = useState(0);
    const [calories, setCalories] = useState(0);
    const [speed, setSpeed] = useState(0.005);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const updateDistance = (deltaZ) => {
        setDistance((prevDistance) => {
            const newDistance = prevDistance + deltaZ;
            setCalories(newDistance * 0.05); // Simple calorie formula
            return newDistance;
        });
    };

    useEffect(() => {
        let timer;
        if (isActive) {
            timer = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
                if ((elapsedTime + 1) % 10 === 0) {
                    alert('10 minute milestone reached!');
                }
            }, 60000); // Increment every minute
        }
        return () => clearInterval(timer);
    }, [elapsedTime, isActive]);

    const startActivity = () => {
        setIsActive(true);
        setElapsedTime(0); // Reset elapsed time when starting
    };

    const stopActivity = () => {
        setIsActive(false);
    };

    return (
        <>
            <Canvas style={{ height: '100vh', backgroundColor: '#f0f0f0' }} shadows>
                <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={75} near={0.1} far={1000} />
                <Lights />
                <TreadmillModel positionZ={0} speed={speed} isActive={isActive} updateDistance={updateDistance} />
                <TreadmillModel positionZ={-15} speed={speed} isActive={isActive} updateDistance={updateDistance} />
                <TreadmillModel positionZ={-25} speed={speed} isActive={isActive} updateDistance={updateDistance} />
                <OrbitControls maxPolarAngle={Math.PI / 2} enableDamping={true} dampingFactor={0.25} />
            </Canvas>
            <MetricsTab distance={distance} calories={calories} elapsedTime={elapsedTime} />
            <SpeedControl speed={speed} setSpeed={setSpeed} />
            <StartStopButtons startActivity={startActivity} stopActivity={stopActivity} />
        </>
    );
};

export default Scene;
