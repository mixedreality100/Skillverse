import React, { useState } from "react";
import { useClerk } from "@clerk/clerk-react"; // Import Clerk

const ProfileButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { signOut } = useClerk(); // Get signOut function from Clerk

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        signOut(); // Call Clerk's signOut function
        setIsOpen(false); // Close dropdown after logout
    };

    return (
        <div className="relative inline-block text-left">
            <button 
                onClick={toggleDropdown} 
                className="flex items-center justify-center bg-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition duration-300"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {/* Profile Icon */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-5 0-6 2-6 2v1h12v-1s-1-2-6-2z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 transform transition-all duration-300 ease-in-out origin-top-right scale-100 opacity-100">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <button 
                            onClick={() => console.log("Dashboard clicked")} 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition duration-200"
                        >
                            Dashboard
                        </button>
                        <button 
                            onClick={() => console.log("Settings clicked")} 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition duration-200"
                        >
                            Settings
                        </button>
                        <button 
                            onClick={handleLogout} // Call handleLogout on click
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileButton;
