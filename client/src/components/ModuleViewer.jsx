import React, { useEffect, useState } from 'react';
import '@google/model-viewer';
import { QRCodeSVG } from 'qrcode.react';

const ModuleViewer = () => {
    // Get the local IP address for the QR code
    const [qrUrl, setQrUrl] = useState('');
    
    useEffect(() => {
        // Replace localhost with your local IP address
        const currentUrl = window.location.href;
        const localIpUrl = currentUrl.replace('localhost', '192.168.x.x'); // Replace with your IP
        // OR use your domain if deployed
        // const localIpUrl = 'https://yourdomain.com' + window.location.pathname;
        setQrUrl(localIpUrl);
    }, []);

    useEffect(() => {
        const modelViewer = document.querySelector('model-viewer');
        if (modelViewer) {
            // Check if enterAR is a function before calling it
            if (typeof modelViewer.enterAR === 'function') {
                modelViewer.enterAR();
            } else {
                console.error('enterAR is not a function on model-viewer');
            }
        } else {
            console.error('model-viewer element not found');
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* 3D Model Viewer */}
            <div className="w-full h-[70vh] bg-white shadow-lg mb-8">
                <model-viewer 
                    src="/model/aleovera.glb" 
                    alt="Aloe Vera 3D model" 
                    auto-rotate 
                    camera-controls 
                    ar 
                    ar-modes="webxr scene-viewer quick-look" 
                    style={{ width: '100%', height: '100%' }}
                    onError={(e) => console.error('Model loading error:', e)}
                    onLoad={() => console.log('Model loaded successfully')}
                >
                </model-viewer>
            </div>

            {/* QR Code Section */}
            <div className="bg-white p-8 rounded-lg shadow-lg text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">View on Mobile</h2>
                <p className="text-gray-600 mb-6">
                    Scan this QR code with your mobile device to view in AR
                </p>
                <div className="inline-block p-4 bg-white rounded-xl shadow-md">
                    <QRCodeSVG 
                        value={qrUrl}
                        size={200}
                        level="H"
                        includeMargin={true}
                    />
                </div>
                <p className="mt-4 text-sm text-gray-500">
                    Supported on most modern Android and iOS devices
                </p>
            </div>
        </div>
    );
};

export default ModuleViewer;
