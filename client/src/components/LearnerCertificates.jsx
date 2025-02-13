import React from "react";

const LearnerCertificates = () => {
  const certificates = [
    { 
        id: 1,
        title: "Alovera", 
        issueDate: "2025-01-01", 
        thumbnail: "https://via.placeholder.com/150" 
     },
    { 
        id: 2, 
        title: "Ashvagandha", 
        issueDate: "2025-01-05", 
        thumbnail: "https://via.placeholder.com/150" 
    },
    { 
        id: 3, 
        title: "Tulsi", 
        issueDate: "2025-01-10", 
        thumbnail: "https://via.placeholder.com/150" },
    { 
        id: 4, 
        title: "Haldi", 
        issueDate: "2025-01-15", 
        thumbnail: "https://via.placeholder.com/150" 
    },
    { 
        id: 5, 
        title: "Garlic", 
        issueDate: "2025-01-20", 
        thumbnail: "https://via.placeholder.com/150" 
    },
    { 
        id: 6, 
        title: "Ginger", 
        issueDate: "2025-01-25", 
        thumbnail: "https://via.placeholder.com/150" 
    },
  ];

  const Certificate = ({ title, issueDate, thumbnail, onDownload }) => (
    <div className="bg-white rounded-lg shadow p-4 w-80">
      <img
        src={thumbnail}
        alt={`${title} thumbnail`}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">Issued on: {issueDate}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={onDownload}
      >
        Download
      </button>
    </div>
  );

  const handleDownload = (title) => {
    alert(`Downloading: ${title}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">My Certificates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {certificates.map((certificate) => (
          <Certificate
            key={certificate.id}
            title={certificate.title}
            issueDate={certificate.issueDate}
            thumbnail={certificate.thumbnail}
            onDownload={() => handleDownload(certificate.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default LearnerCertificates;
