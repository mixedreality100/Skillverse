import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SketchfabVR = () => {
  const { moduleId } = useParams();
  const [moduleDetails, setModuleDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/modules/${moduleId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const moduleData = await response.json();
        if (moduleData.length > 0) {
          setModuleDetails(moduleData[0]); // Set the module details
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!moduleDetails) {
    return <div>Module details not found</div>;
  }

  const benefit4Description = moduleDetails.benefit4_description || 'Default Description';

  return (
    <div className="sketchfab-embed-wrapper">
      <iframe
        title="Foliage Asset (3D): Aloe Vera Plant"
        frameBorder="0"
        allowFullScreen
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        src={benefit4Description}
        style={{ width: '100%', height: '800px' }} // Adjust height as needed
      >
      </iframe>
      
    </div>
  );
};

export { SketchfabVR };