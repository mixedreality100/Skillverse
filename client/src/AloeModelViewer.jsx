import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import styled from 'styled-components';

// Styled components for the UI
const ViewerContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #cce4e4, #a3d8d8);
`;

const LoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  z-index: 1000;
`;

const InfoWindow = styled.div`
  position: absolute;
  background: white;
  color: darkblue;
  padding: 15px;
  border-radius: 8px;
  display: none;
  pointer-events: auto;
  transition: opacity 0.3s;
  max-width: 300px;
  z-index: 1001;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  font-family: 'DM Sans', sans-serif;
`;

const AloeModelViewer = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  const originalCameraPosition = new THREE.Vector3(-0.3448812670732787, 0.4012495514565061, 0.5344829114016636);

  useEffect(() => {
    // Initialize scene
    const init = () => {
      // Create scene
      sceneRef.current = new THREE.Scene();

      // Set up camera
      cameraRef.current = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      cameraRef.current.position.copy(originalCameraPosition);

      // Set up renderer
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current.setClearColor(0xcce4e4);
      containerRef.current.appendChild(rendererRef.current.domElement);

      // Add controls
      controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.25;
      controlsRef.current.enableZoom = false;

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      sceneRef.current.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 7.5);
      sceneRef.current.add(directionalLight);

      // Load model
      loadModel();
    };

    // ... Rest of your functions (loadModel, createHotspots, etc.) converted to use refs ...

    init();

    // Cleanup
    return () => {
      if (rendererRef.current) {
        containerRef.current?.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <ViewerContainer ref={containerRef}>
      <LoadingScreen id="loading">
        Loading... <span id="progress">0%</span>
      </LoadingScreen>
      <InfoWindow id="infoWindow">
        <span id="closeButton">×</span>
        <div id="infoTitle"></div>
        <div id="infoDescription"></div>
      </InfoWindow>
    </ViewerContainer>
  );
};

export default AloeModelViewer;