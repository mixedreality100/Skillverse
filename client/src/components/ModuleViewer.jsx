// In ModuleViewer.jsx
import React, { useEffect, useState } from 'react';
import '@google/model-viewer';
import { QRCodeSVG } from 'qrcode.react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import styled from 'styled-components';
import Button from './Button';

const ModuleViewer = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation to access the state
  const [qrUrl, setQrUrl] = useState('');
  const [moduleDetails, setModuleDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUrl = window.location.href;
    const localIpUrl = currentUrl.replace('localhost', '192.168.x.x'); // Replace with your IP
    setQrUrl(localIpUrl);

    const fetchModuleDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/modules/${moduleId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const moduleData = await response.json();
        if (moduleData.length > 0) {
          setModuleDetails(moduleData[0]);
        } else {
          console.error("Module not found");
        }
      } catch (error) {
        console.error("Error fetching module details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchModuleDetails();
    }
  }, [moduleId]);

  const handleBack = () => {
    // Check if the state contains scrollToInteractive
    const shouldScrollToInteractive = location.state?.scrollToInteractive || false;
    navigate(`/aloepage/${moduleId}`, {
      state: { 
        scrollToInteractive: shouldScrollToInteractive, // Pass the scroll instruction back
        fromApp: true 
      },
      replace: true // Replace the current history entry to avoid stacking
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!moduleDetails) {
    return <div>Module details not found</div>;
  }

  const glbFileBase64 = moduleDetails.glb_file_base64 || '/model/aleovera.glb';

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[#77887c] flex items-center justify-center">
      <BackButtonContainer>
        <Button onClick={handleBack}>Back</Button>
      </BackButtonContainer>

      <model-viewer
        src={glbFileBase64}
        alt="Aloe Vera 3D model"
        auto-rotate
        camera-controls
        ar
        ar-modes="webxr scene-viewer quick-look"
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />

      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg">
        <h2 className="text-xs font-semibold text-gray-800 text-center mb-1">View in Mobile</h2>
        <QRCodeSVG value={qrUrl} size={100} level="H" />
      </div>
    </div>
  );
};

const BackButtonContainer = styled.div`
  position: absolute;
  top: 32px;
  left: 30px;
  cursor: pointer;
  z-index: 10;

  @media (max-width: 768px) {
    top: 20px;
    left: 15px;
  }
`;

export default ModuleViewer;