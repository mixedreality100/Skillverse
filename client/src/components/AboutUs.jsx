import React from "react";
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/'); // Navigate to the Landing Page
    };

    return (
        <div className="min-h-screen bg-white p-8 relative overflow-hidden">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-[url('/path/to/your/background.jpg')] bg-cover opacity-30"></div>

            {/* Back Button to navigate to Landing Page */}
            <button 
                className="absolute top-5 left-5 bg-orange-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 transition duration-300"
                onClick={handleBackClick}
            >
                Back to Home
            </button>

            {/* Hero Section */}
            <div className="text-center mb-20 pt-12 relative z-10">
                <h1 className="text-6xl font-extrabold text-black mb-6">About Us</h1>
                <p className="text-2xl text-black-300 max-w-3xl mx-auto leading-relaxed mb-8">
                    Pioneering the future of education through immersive VR experiences that inspire, engage, and transform learning.
                </p>
            </div>

            {/* Mission Section */}
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-12 mb-20 relative z-10">
                <h2 className="text-4xl font-bold text-black mb-6">Our Mission</h2>
                <p className="text-xl text-black-300 leading-relaxed">
                    To revolutionize education through virtual reality technology, making learning more engaging, interactive, and accessible for everyone. We believe in creating experiences that not only educate but inspire the next generation of learners.
                </p>
            </div>

            {/* Values Section */}
            <div className="max-w-6xl mx-auto mb-20 relative z-10">
                <h2 className="text-4xl font-bold text-black text-center mb-12">Our Values</h2>
                <div className="grid grid-cols-3 gap-8">
                    <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-2xl font-bold text-orange-500 mb-4">Innovation</h3>
                        <p className="text-black-300">Pushing boundaries in educational technology to create groundbreaking learning experiences.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-2xl font-bold text-orange-500 mb-4">Accessibility</h3>
                        <p className="text-black-300">Making quality education available to everyone, everywhere through VR technology.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-2xl font-bold text-orange-500 mb-4">Excellence</h3>
                        <p className="text-black-300">Committed to delivering the highest quality educational content and experiences.</p>
                    </div>
                </div>
            </div>

            {/* <div className="max-w-6xl mx-auto relative z-10">
                <h2 className="text-4xl font-bold text-black text-center mb-12">Meet Our Team</h2>
                <div className="grid grid-cols-3 gap-12 justify-items-center">
                    <div className="text-center group">
                        <div className="w-48 h-48 rounded-full border border-gray-300 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black">
                            <div className="bg-white/10 backdrop-blur-lg h-full w-full rounded-full overflow-hidden flex items-center justify-center transition-all duration-300">
                                <img 
                                    src="" 
                                    alt="Team Member 1"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-black">Eshan Biswas</h3>
                    </div>
                    <div className="text-center group">
                        <div className="w-48 h-48 rounded-full border border-gray-300 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black">
                            <div className="bg-white/10 backdrop-blur-lg h-full w-full rounded-full overflow-hidden flex items-center justify-center transition-all duration-300">
                                <img 
                                    src="" 
                                    alt="Team Member 2"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-black">Rhys Vales</h3>
                    </div>

                    <div className="text-center group">
                        <div className="w-48 h-48 rounded-full border border-gray-300 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black">
                            <div className="bg-white/10 backdrop-blur-lg h-full w-full rounded-full overflow-hidden flex items-center justify-center transition-all duration-300">
                                <img 
                                    src="" 
                                    alt="Team Member 3"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-black">Joel Travasso</h3>
                    </div>

                    <div className="text-center group">
                        <div className="w-48 h-48 rounded-full border border-gray-300 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black">
                            <div className="bg-white/10 backdrop-blur-lg h-full w-full rounded-full overflow-hidden flex items-center justify-center transition-all duration-300">
                                <img 
                                    src="" 
                                    alt="Team Member 4"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-black">Prachi Prabhu</h3>
                    </div>

                    <div className="text-center group">
                        <div className="w-48 h-48 rounded-full border border-gray-300 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black">
                            <div className="bg-white/10 backdrop-blur-lg h-full w-full rounded-full overflow-hidden flex items-center justify-center transition-all duration-300">
                                <img 
                                    src="" 
                                    alt="Team Member 5"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-black">Dylan Frias</h3>
                    </div>

                    <div className="text-center group">
                        <div className="w-48 h-48 rounded-full border border-gray-300 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-black">
                            <div className="bg-white/10 backdrop-blur-lg h-full w-full rounded-full overflow-hidden flex items-center justify-center transition-all duration-300">
                                <img 
                                    src="" 
                                    alt="Team Member 6"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-black">Muskan Khatun</h3>
                    </div>
                </div>
            </div> */}

            {/* Footer Section */}
            <footer className="w-full mt-20 relative z-10">
                <div className="relative w-full h-[440px] bg-[url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')] bg-cover">
                    <div className="absolute bottom-0 left-0 right-0 w-full h-[178px] bg-white rounded-t-[12px]">
                        <div className="flex justify-center space-x-4 mt-4">
                            <button className="w-48 h-11 bg-white border border-black rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 hover:text-white hover:scale-105 transition duration-200">
                                Instagram
                            </button>
                            <button className="w-48 h-11 bg-white border border-black rounded-full hover:bg-black hover:text-white hover:scale-105 transition duration-200">
                                Twitter
                            </button>
                            <button className="w-48 h-11 bg-white border border-black rounded-full hover:bg-blue-500 hover:text-white hover:scale-105 transition duration-200">
                                Facebook
                            </button>
                            <button className="w-48 h-11 bg-white border border-black rounded-full hover:bg-red-500 hover:text-white hover:scale-105 transition duration-200">
                                Pinterest
                            </button>
                        </div>

                        <div className="mt-4 border-t border-gray-300"></div>

                        <div className="text-center mt-2">
                            <p className="text-xl text-gray-800">© 2024, All Rights Reserved</p>
                        </div>
                    </div>

                    <p className="absolute top-[40px] left-1/2 transform -translate-x-1/2 text-[64px] font-normal text-center text-white">
                        Be the one with
                        <span className="text-red-500"> Nat</span>
                        <span className="text-[#B9DE00]">ur</span>
                        <span className="text-red-500">e</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}