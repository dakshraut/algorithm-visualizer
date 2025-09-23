// Update your Navbar component (components/Navbar.jsx)

import React from 'react';

const Navbar = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-xl py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div 
          className="flex items-center cursor-pointer group"
          onClick={() => setCurrentPage('home')}
        >
          <div className="bg-white p-2 rounded-lg mr-3 transform group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Algorithm Visualizer</h1>
        </div>
        
        <div className="flex space-x-2">
          {/* Home Button */}
          <button 
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              currentPage === 'home' 
                ? 'bg-white text-purple-600 shadow-lg' 
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            }`}
            onClick={() => setCurrentPage('home')}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Home
            </span>
          </button>
          
          {/* Algorithm Comparison Button - ADD THIS */}
          <button 
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              currentPage === 'comparison' 
                ? 'bg-white text-purple-600 shadow-lg' 
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            }`}
            onClick={() => setCurrentPage('comparison')}
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Compare
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;