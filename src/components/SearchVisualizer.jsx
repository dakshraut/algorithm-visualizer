import React, { useState, useEffect, useRef } from 'react';

const SearchVisualizer = () => {
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState(45);
  const [searching, setSearching] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState('binarySearch');
  const [currentIndex, setCurrentIndex] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [low, setLow] = useState(null);
  const [high, setHigh] = useState(null);
  const [mid, setMid] = useState(null);
  const [searchResult, setSearchResult] = useState('');
  const [comparisonCount, setComparisonCount] = useState(0);
  const [arrayType, setArrayType] = useState('fixed');
  const timeoutRef = useRef(null);

  // Generate array based on selected type
  const generateArray = (type = arrayType) => {
    let newArray = [];
    
    if (type === 'fixed') {
      // Use the fixed array from the image
      newArray = [17, 18, 23, 34, 37, 38, 39, 41, 43, 50, 60, 64, 81, 82, 83, 89, 92, 98, 99];
    } else if (type === 'random') {
      // Generate random sorted array
      for (let i = 0; i < 20; i++) {
        newArray.push(Math.floor(Math.random() * 91) + 10); // 10-100
      }
      newArray.sort((a, b) => a - b);
    } else if (type === 'uniform') {
      // Array with uniform distribution
      const baseValue = Math.floor(Math.random() * 30) + 10;
      for (let i = 0; i < 20; i++) {
        newArray.push(baseValue + i * 4);
      }
    } else if (type === 'large-range') {
      // Array with large value range
      for (let i = 0; i < 20; i++) {
        newArray.push(Math.floor(Math.random() * 191) + 10); // 10-200
      }
      newArray.sort((a, b) => a - b);
    }
    
    setArray(newArray);
    resetStates();
  };

  const resetStates = () => {
    setCurrentIndex(null);
    setFoundIndex(null);
    setLow(null);
    setHigh(null);
    setMid(null);
    setSearchResult('');
    setComparisonCount(0);
    clearTimeout(timeoutRef.current);
    setSearching(false);
  };

  useEffect(() => {
    generateArray();
  }, [arrayType]);

  // Algorithms
  const linearSearch = async () => {
    setSearching(true);
    resetStates();
    let comparisons = 0;
    
    for (let i = 0; i < array.length; i++) {
      comparisons++;
      setComparisonCount(comparisons);
      setCurrentIndex(i);
      
      await new Promise(resolve => 
        timeoutRef.current = setTimeout(resolve, 1000 - speed * 10)
      );
      
      if (array[i] === target) {
        setFoundIndex(i);
        setSearchResult(`Element found at index ${i}`);
        setSearching(false);
        return;
      }
    }
    
    setSearchResult('Element not found');
    setSearching(false);
  };

  const binarySearch = async () => {
    setSearching(true);
    resetStates();
    let comparisons = 0;
    
    let low = 0;
    let high = array.length - 1;
    
    setLow(low);
    setHigh(high);
    
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      comparisons++;
      setComparisonCount(comparisons);
      setMid(mid);
      setCurrentIndex(mid);
      
      await new Promise(resolve => 
        timeoutRef.current = setTimeout(resolve, 1000 - speed * 10)
      );
      
      if (array[mid] === target) {
        setFoundIndex(mid);
        setSearchResult(`Element found at index ${mid}`);
        setSearching(false);
        return;
      } else if (array[mid] < target) {
        low = mid + 1;
        setLow(low);
      } else {
        high = mid - 1;
        setHigh(high);
      }
      
      await new Promise(resolve => 
        timeoutRef.current = setTimeout(resolve, 1000 - speed * 10)
      );
    }
    
    setSearchResult('Element not found');
    setSearching(false);
  };

  const runAlgorithm = () => {
    resetStates();
    
    switch (algorithm) {
      case 'linearSearch':
        linearSearch();
        break;
      case 'binarySearch':
        binarySearch();
        break;
      default:
        binarySearch();
    }
  };

  const stopAlgorithm = () => {
    resetStates();
  };

  const handleTargetChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setTarget('');
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setTarget(numValue);
    }
  };

  const getAlgorithmName = () => {
    switch (algorithm) {
      case 'linearSearch': return 'Linear Search';
      case 'binarySearch': return 'Binary Search';
      default: return 'Binary Search';
    }
  };

  const getAlgorithmDescription = () => {
    switch (algorithm) {
      case 'linearSearch': return 'Sequentially checks each element of the list until a match is found or the whole list has been searched. Works on both sorted and unsorted arrays.';
      case 'binarySearch': return 'Efficiently finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.';
      default: return 'Efficiently finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.';
    }
  };

  const getTimeComplexity = () => {
    switch (algorithm) {
      case 'linearSearch': return { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' };
      case 'binarySearch': return { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' };
      default: return { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Search Algorithm Visualizer</h1>
      
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">{getAlgorithmName()}</h2>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={runAlgorithm}
              disabled={searching || target === ''}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Search
            </button>
            <button
              onClick={stopAlgorithm}
              disabled={!searching}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5a2 2 0 11-4 0 2 2 0 014 0zM12 5h6M12 9h6M12 13h4"></path>
              </svg>
              Stop
            </button>
            <button
              onClick={() => generateArray()}
              disabled={searching}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              New Array
            </button>
            <button
              onClick={resetStates}
              className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-xl hover:from-gray-600 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={searching}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="binarySearch">Binary Search</option>
              <option value="linearSearch">Linear Search</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Speed</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              disabled={searching}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="10">Slow</option>
              <option value="50">Normal</option>
              <option value="100">Fast</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
            <input
              type="number"
              min="10"
              max="200"
              value={target}
              onChange={handleTargetChange}
              disabled={searching}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter target value"
            />
            <div className="text-xs text-gray-500 mt-1">
              Current array: [{array.join(', ')}]
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Array Type</label>
            <select
              value={arrayType}
              onChange={(e) => setArrayType(e.target.value)}
              disabled={searching}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="fixed">Fixed</option>
              <option value="random">Random Values</option>
              <option value="uniform">Uniform Distribution</option>
              <option value="large-range">Large Range</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Search Result Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl text-center shadow">
        <div className="text-lg font-semibold text-blue-800">
          {searchResult || (target === '' ? 'Please enter a target value' : 'Enter a target value and click Search')}
        </div>
        {(searching || searchResult) && (
          <div className="mt-2 text-sm text-gray-600">
            Comparisons: {comparisonCount} | Time Complexity: {algorithm === 'linearSearch' ? 'O(n)' : 'O(log n)'}
          </div>
        )}
      </div>
      
      {/* Array Visualization */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
        <div className="h-32 flex items-end justify-center gap-1 mb-4 bg-gray-100 rounded-xl p-4">
          {array.map((value, idx) => {
            const isCurrent = currentIndex === idx;
            const isFound = foundIndex === idx;
            const isLow = low === idx;
            const isHigh = high === idx;
            const isMid = mid === idx;
            const inSearchRange = low !== null && high !== null && idx >= low && idx <= high;
            
            let backgroundColor = 'bg-gray-300';
            if (inSearchRange) backgroundColor = 'bg-blue-200';
            if (isCurrent) backgroundColor = 'bg-yellow-400';
            if (isFound) backgroundColor = 'bg-green-500';
            if (isLow || isHigh) backgroundColor = 'bg-purple-300';
            if (isMid) backgroundColor = 'bg-red-400';
            
            return (
              <div
                key={idx}
                className={`${backgroundColor} transition-all duration-300 ease-in-out flex flex-col items-center justify-end text-xs font-bold border border-gray-300 rounded-t-xl`}
                style={{
                  height: `${value}%`,
                  width: '4%',
                  minWidth: '40px',
                }}
              >
                <div className="mt-1 text-xs">{value}</div>
                <div className="bg-white bg-opacity-80 px-1 rounded text-xs mb-1">{idx}</div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 mr-2 rounded"></div>
            <span className="text-sm">Element</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-200 mr-2 rounded"></div>
            <span className="text-sm">Search Range</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 mr-2 rounded"></div>
            <span className="text-sm">Current Element</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
            <span className="text-sm">Found Element</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-300 mr-2 rounded"></div>
            <span className="text-sm">Low/High Pointer</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-400 mr-2 rounded"></div>
            <span className="text-sm">Mid Pointer</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{getAlgorithmName()}</h2>
        <p className="text-gray-700 mb-6">
          {getAlgorithmDescription()}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="font-bold text-gray-800">Best Case</div>
            <div className="text-green-600 font-semibold">{getTimeComplexity().best}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
            <div className="font-bold text-gray-800">Average Case</div>
            <div className="text-yellow-600 font-semibold">{getTimeComplexity().average}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
            <div className="font-bold text-gray-800">Worst Case</div>
            <div className="text-red-600 font-semibold">{getTimeComplexity().worst}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="font-bold text-gray-800">Space</div>
            <div className="text-blue-600 font-semibold">{getTimeComplexity().space}</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <h3 className="font-semibold text-blue-800 mb-2">Performance Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Linear Search:</span>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Works on any array (sorted or unsorted)</li>
                <li>Time Complexity: O(n)</li>
                <li>Simple to implement</li>
              </ul>
            </div>
            <div>
              <span className="font-medium">Binary Search:</span>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Requires sorted array</li>
                <li>Time Complexity: O(log n)</li>
                <li>Much faster for large arrays</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchVisualizer;