import React, { useState, useEffect } from 'react';

const ExploreModule = ({ courseId, onBackClick }) => {
  const [modules, setModules] = useState([]); // State to store fetched modules

  useEffect(() => {
    // Function to fetch modules by course ID from the backend
    const fetchModules = async () => {
      try {
        const response = await fetch(`http://localhost:3000/modules/${courseId}`);
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        setModules(data); // Update the modules state with fetched data
      } catch (error) {
        console.error('Error fetching modules:', error);
        alert(`Error fetching modules: ${error.message}`);
      }
    };

    if (courseId) {
      fetchModules(); // Call the function to fetch modules when the component mounts
    }
  }, [courseId]);

  const handleDeleteModule = async (moduleId) => {
    try {
      const response = await fetch(`http://localhost:3000/delete-module/${moduleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      alert('Module deleted successfully');
      // Optionally, you can reload the modules list or update the state to reflect the deletion
      const updatedModules = modules.filter(module => module.id !== moduleId);
      setModules(updatedModules);
    } catch (error) {
      console.error('Error deleting module:', error);
      alert(`Error deleting module: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4"> {/* Aligns the button to the right */}
        <button
          onClick={onBackClick} // Trigger back to MyCourses
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i> {/* Font Awesome arrow icon */}
          Back to My Courses
        </button>
      </div>
      <h2 className="text-3xl font-bold mb-6">Explore Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={module.module_image || 'https://via.placeholder.com/150'} // Use placeholder if no image
              alt={module.module_title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-4">{module.module_title}</h3>
              <div className="flex justify-center gap-4">
                {/* Edit Button */}
                <button className="bg-white border border-black text-black px-4 py-2 rounded-full text-sm hover:bg-green-100 hover:border-green-500 hover:text-green-600 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-md">
                  Edit
                </button>
                {/* Delete Button */}
                <button
                  className="bg-white border border-black text-black px-4 py-2 rounded-full text-sm hover:bg-red-100 hover:border-red-500 hover:text-red-600 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-md"
                  onClick={() => handleDeleteModule(module.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreModule;