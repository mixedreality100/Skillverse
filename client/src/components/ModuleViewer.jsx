import React, { useEffect, useState } from 'react';
import '@google/model-viewer';
import { QRCodeSVG } from 'qrcode.react';

const ModuleViewer = () => {
    const [qrUrl, setQrUrl] = useState('');

    useEffect(() => {
        const currentUrl = window.location.href;
        const localIpUrl = currentUrl.replace('localhost', '192.168.x.x'); // Replace with your IP
        setQrUrl(localIpUrl);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-[#77887c] flex items-center justify-center">
            {/* Full-Screen 3D Model Viewer */}
            <model-viewer
                src="/model/aleovera.glb"
                alt="Aloe Vera 3D model"
                auto-rotate
                camera-controls
                ar
                ar-modes="webxr scene-viewer quick-look"
                className="w-full h-full"
                style={{ width: '100%', height: '100%' }}
            />

            {/* QR Code - Positioned at the top-right corner */}
            <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg">
                <h2 className="text-xs font-semibold text-gray-800 text-center mb-1">View in Mobile</h2>
                <QRCodeSVG value={qrUrl} size={100} level="H" />
            </div>
        </div>
    );
};

export default ModuleViewer;
