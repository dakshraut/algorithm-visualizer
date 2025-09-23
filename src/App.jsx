import React, { useState } from 'react';
import SortingVisualizer from './components/SortingVisualizer';
import SearchVisualizer from './components/SearchVisualizer';
import PathfindingVisualizer from './components/PathfindingVisualizer';
import AlgorithmComparison from './components/AlgorithmComparison';
import Navbar from './components/Navbar';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'sorting':
        return <SortingVisualizer />;
      case 'search':
        return <SearchVisualizer />;
      case 'pathfinding':
        return <PathfindingVisualizer />;
           case 'comparison':  // ADD THIS CASE
      return <AlgorithmComparison />;
      default:
        return (
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-16 mt-8">
              <div className="inline-block bg-gradient-to-r from-purple-600 to-indigo-700 p-1 rounded-2xl mb-6">
                <div className="bg-white rounded-2xl px-6 py-2">
                  <span className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700">
                    Interactive Learning Platform
                  </span>
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700">
                Algorithm Visualizer
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore beautiful visualizations of computer science algorithms. 
                Watch data structures come to life with interactive animations and step-by-step explanations.
              </p>
            </div>

            

            {/* Algorithm Cards Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Sorting Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
                <div className="bg-gradient-to-br from-green-400 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Sorting Algorithms</h2>
                <p className="mb-4 text-gray-600 text-center">Visualize how different sorting algorithms organize data</p>
                <div className="mb-6 flex-grow">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <span className="text-sm font-medium text-green-700">Bubble Sort</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <span className="text-sm font-medium text-green-700">Quick Sort</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <span className="text-sm font-medium text-green-700">Merge Sort</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <span className="text-sm font-medium text-green-700">Heap Sort</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <span className="text-sm font-medium text-green-700">Insertion Sort</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <span className="text-sm font-medium text-green-700">Selection Sort</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentPage('sorting')}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center mt-auto"
                >
                  <span>Explore Sorting</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>

              {/* Search Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Search Algorithms</h2>
                <p className="mb-4 text-gray-600 text-center">Watch search algorithms find targets in sorted data</p>
                <div className="mb-6 flex-grow">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <span className="text-sm font-medium text-blue-700">Binary Search</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <span className="text-sm font-medium text-blue-700">Linear Search</span>
                    </div>
                    <div className="h-10"></div> {/* Spacer for equal height */}
                    <div className="h-10"></div> {/* Spacer for equal height */}
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentPage('search')}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center mt-auto"
                >
                  <span>Explore Search</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>

              {/* Pathfinding Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Pathfinding Algorithms</h2>
                <p className="mb-4 text-gray-600 text-center">Explore how algorithms navigate through obstacles to find optimal paths</p>
                <div className="mb-6 flex-grow">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-purple-50 rounded-lg p-2 text-center">
                      <span className="text-sm font-medium text-purple-700">Dijkstra's</span>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2 text-center">
                      <span className="text-sm font-medium text-purple-700">A* Search</span>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2 text-center">
                      <span className="text-sm font-medium text-purple-700">BFS</span>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2 text-center">
                      <span className="text-sm font-medium text-purple-700">DFS</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentPage('pathfinding')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center mt-auto"
                >
                  <span>Explore Pathfinding</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 shadow-inner mb-16">
              <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Why Use Our Algorithm Visualizer?</h2>
              <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105">
                  <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Interactive Learning</h3>
                  <p className="text-gray-600">Step-by-step visualizations with customizable speed and real-time explanations</p>
                </div>
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105">
                  <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Multiple Algorithms</h3>
                  <p className="text-gray-600">Compare different approaches and understand time/space complexity trade-offs</p>
                </div>
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105">
                  <div className="bg-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Beautiful Animations</h3>
                  <p className="text-gray-600">Smooth, color-coded animations that make complex concepts easy to understand</p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-12 text-gray-800">Visualize. Learn. Master.</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105">
                  <div className="text-4xl font-bold text-green-600 mb-2">6</div>
                  <div className="text-gray-600">Sorting Algorithms</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105">
                  <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
                  <div className="text-gray-600">Search Algorithms</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105">
                  <div className="text-4xl font-bold text-purple-600 mb-2">4</div>
                  <div className="text-gray-600">Pathfinding Algorithms</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">∞</div>
                  <div className="text-gray-600">Learning Possibilities</div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;