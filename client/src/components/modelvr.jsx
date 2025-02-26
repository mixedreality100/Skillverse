import React from 'react';

const SketchfabVR = () => {
    return (
        <div className="sketchfab-embed-wrapper">
            <iframe
                title="Foliage Asset (3D): Aloe Vera Plant"
                frameBorder="0"
                allowFullScreen
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                src="https://sketchfab.com/models/689a4edc310149938fddf1e875bf2562/embed"
                style={{ width: '100%', height: '500px' }} // Adjust height as needed
            >
            </iframe>
            <p style={{ fontSize: '13px', fontWeight: 'normal', margin: '5px', color: '#4A4A4A' }}>
                <a
                    href="https://sketchfab.com/3d-models/foliage-asset-3d-aloe-vera-plant-689a4edc310149938fddf1e875bf2562?utm_medium=embed&utm_campaign=share-popup&utm_content=689a4edc310149938fddf1e875bf2562"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9' }}
                >
                    Foliage Asset (3D): Aloe Vera Plant
                </a> by 
                <a
                    href="https://sketchfab.com/nyabsino?utm_medium=embed&utm_campaign=share-popup&utm_content=689a4edc310149938fddf1e875bf2562"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9' }}
                >
                    Nyabsino KMM™
                </a> on 
                <a
                    href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=689a4edc310149938fddf1e875bf2562"
                    target="_blank"
                    rel="nofollow"
                    style={{ fontWeight: 'bold', color: '#1CAAD9' }}
                >
                    Sketchfab
                </a>
            </p>
        </div>
    );
};

export { SketchfabVR };