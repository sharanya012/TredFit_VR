import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Sky } from '@react-three/drei';
// Model for the Treadmill
const TreadmillModel = ({ lightIntensity }) => {
    const treadmill = useLoader(GLTFLoader, '/models/scene3.glb');

    useEffect(() => {
        if (treadmill && treadmill.scene) {
            treadmill.scene.traverse((node) => {
                if (node.isMesh && node.material) {
                    // Adjust material properties based on lightIntensity
                    if ('roughness' in node.material) {
                        node.material.roughness = THREE.MathUtils.lerp(0.4, 0.1, lightIntensity);
                    }
                    if ('metalness' in node.material) {
                        node.material.metalness = THREE.MathUtils.lerp(0.6, 1.0, lightIntensity);
                    }
                    if ('emissiveIntensity' in node.material) {
                        node.material.emissiveIntensity = THREE.MathUtils.lerp(0, 1, lightIntensity);
                    }
                }
            });
        }
    }, [treadmill, lightIntensity]);

    // Slow rotation of the model
    useFrame(() => {
        if (treadmill && treadmill.scene) {
            treadmill.scene.rotation.y += 0.001; // Adjust the speed of rotation here
        }
    });

    return (
        <primitive
            object={treadmill.scene}
            scale={[0.2, 0.2, 0.2]} // Adjust treadmill scale
            position={[0, 0, 0]} // Position treadmill in the scene
        />
    );
};

const Scene = () => {
    const [lightIntensity, setLightIntensity] = useState(0.5); // Control lighting intensity

    useEffect(() => {
        // Animation loop for changing light intensity
        const animateLightIntensity = () => {
            setLightIntensity((prevIntensity) => {
                const newIntensity = (Math.sin(Date.now() * 0.001) + 1) / 2; // Oscillates between 0 and 1
                return newIntensity;
            });

            // Request the next frame
            requestAnimationFrame(animateLightIntensity);
        };

        // Start the animation loop
        animateLightIntensity();

    }, []);

    return (
        <Canvas
    style={{ height: '100vh' }}
    shadows
    gl={{ clearColor: '#87CEEB' }}
>
<Sky
                distance={450000} // Camera distance
                sunPosition={[0, 1, 0]} // Sun direction
                inclination={0.49} // Sun elevation
                azimuth={0.25} // Sun position in sky
            />

    <ambientLight intensity={0.3} />
    <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
    />
    <spotLight
        position={[0, 5, 10]}
        intensity={2}
        angle={Math.PI / 6}
        penumbra={0.5}
        castShadow
    />
    <TreadmillModel lightIntensity={lightIntensity} />
    <OrbitControls />
</Canvas>

    );
};

export default Scene;
