// Scene2.js
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const TreadmillModel = ({ positionZ, updateDistance }) => {
    const treadmill = useLoader(GLTFLoader, '/models/scene2.glb');
    const ref = useRef();

    useEffect(() => {
        if (treadmill && treadmill.scene) {
            treadmill.scene.traverse((node) => {
                if (node.isMesh && node.material) {
                    if ('roughness' in node.material) {
                        node.material.roughness = 0.5;
                    }
                    if ('metalness' in node.material) {
                        node.material.metalness = 0.5;
                    }
                    node.material.needsUpdate = true;
                }
            });
        }
    }, [treadmill]);

    useFrame(() => {
        if (ref.current) {
            ref.current.position.z += 0.005; // Move the treadmill forward
            updateDistance(0.01); // Update distance traveled

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

const Lights = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <hemisphereLight intensity={0.3} skyColor={new THREE.Color(0x87ceeb)} groundColor={new THREE.Color(0xaaaaaa)} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={0.8} castShadow />
            <spotLight position={[0, 10, 0]} intensity={1} angle={Math.PI / 4} penumbra={0.5} castShadow />
        </>
    );
};

// Component to display metrics
const MetricsTab = ({ distance, calories }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            padding: '10px',
            backgroundColor: '#000000',
            borderRadius: '8px',
            width: '150px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            fontFamily: 'Arial, sans-serif',
        }}>
            <p>Kms Traveled: {(distance / 900).toFixed(2)} km</p>
            <p>Calories Burnt: {calories.toFixed(2)} kcal</p>
        </div>
    );
};

const Scene2 = () => {
    const [distance, setDistance] = useState(0);
    const [calories, setCalories] = useState(0);

    const updateDistance = (deltaZ) => {
        setDistance((prevDistance) => {
            const newDistance = prevDistance + deltaZ;
            setCalories(newDistance * 0.05); // Simple calorie formula: adjust as needed
            return newDistance;
        });
    };

    return (
        <>
            <Canvas style={{ height: '100vh', backgroundColor: '#f0f0f0' }} shadows>
                <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={75} near={0.1} far={1000} />
                <Lights />
                <TreadmillModel positionZ={0} updateDistance={updateDistance} />
                <TreadmillModel positionZ={-15} updateDistance={updateDistance} />
                <TreadmillModel positionZ={-25} updateDistance={updateDistance} />
                <OrbitControls maxPolarAngle={Math.PI / 2} enableDamping={true} dampingFactor={0.25} />
            </Canvas>
            <MetricsTab distance={distance} calories={calories} />
        </>
    );
};

export default Scene2;
