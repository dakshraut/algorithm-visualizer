import React, { useState, useEffect } from 'react';

const AlgorithmComparison = () => {
  const [activeCategory, setActiveCategory] = useState('sorting');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState(['bubbleSort', 'quickSort']);
  const [isRunning, setIsRunning] = useState(false);
  const [testData, setTestData] = useState({});
  const [results, setResults] = useState({});

  // All algorithms data
  const algorithmCategories = {
    sorting: {
      title: 'Sorting Algorithms',
      algorithms: {
        bubbleSort: { 
          name: 'Bubble Sort', 
          color: '#EF4444',
          gradient: 'from-red-500 to-pink-500',
          complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' }
        },
        quickSort: { 
          name: 'Quick Sort', 
          color: '#10B981',
          gradient: 'from-green-500 to-teal-500',
          complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' }
        },
        mergeSort: { 
          name: 'Merge Sort', 
          color: '#3B82F6',
          gradient: 'from-blue-500 to-indigo-500',
          complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' }
        },
        heapSort: { 
          name: 'Heap Sort', 
          color: '#8B5CF6',
          gradient: 'from-purple-500 to-violet-500',
          complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' }
        },
        insertionSort: { 
          name: 'Insertion Sort', 
          color: '#F59E0B',
          gradient: 'from-yellow-500 to-orange-500',
          complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' }
        },
        selectionSort: { 
          name: 'Selection Sort', 
          color: '#EC4899',
          gradient: 'from-pink-500 to-rose-500',
          complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' }
        }
      }
    },
    searching: {
      title: 'Search Algorithms',
      algorithms: {
        binarySearch: { 
          name: 'Binary Search', 
          color: '#3B82F6',
          gradient: 'from-blue-500 to-indigo-500',
          complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' }
        },
        linearSearch: { 
          name: 'Linear Search', 
          color: '#10B981',
          gradient: 'from-green-500 to-teal-500',
          complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' }
        }
      }
    },
    pathfinding: {
      title: 'Pathfinding Algorithms',
      algorithms: {
        dijkstra: { 
          name: 'Dijkstra\'s', 
          color: '#8B5CF6',
          gradient: 'from-purple-500 to-violet-500',
          complexity: { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)', space: 'O(V)' }
        },
        aStar: { 
          name: 'A* Search', 
          color: '#F59E0B',
          gradient: 'from-yellow-500 to-orange-500',
          complexity: { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)', space: 'O(V)' }
        },
        bfs: { 
          name: 'Breadth-First Search', 
          color: '#10B981',
          gradient: 'from-green-500 to-teal-500',
          complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' }
        },
        dfs: { 
          name: 'Depth-First Search', 
          color: '#EF4444',
          gradient: 'from-red-500 to-pink-500',
          complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' }
        }
      }
    }
  };

  // Initialize test data
  useEffect(() => {
    const initialTestData = {
      sorting: { arraySize: 100, arrayType: 'random' },
      searching: { arraySize: 50, target: 42 },
      pathfinding: { gridSize: '20x30', obstacles: '30%' }
    };
    setTestData(initialTestData);
    
    // Set initial selected algorithms
    setSelectedAlgorithms(['bubbleSort', 'quickSort']);
  }, []);

  const runComparison = async () => {
    setIsRunning(true);
    
    // Simulate performance testing
    const newResults = {};
    const categoryAlgorithms = algorithmCategories[activeCategory].algorithms;
    
    for (const algoId of selectedAlgorithms) {
      const algo = categoryAlgorithms[algoId];
      
      // Simulate different performance based on algorithm type and category
      let executionTime, operations, memory;
      
      switch (activeCategory) {
        case 'sorting':
          executionTime = simulateSortingPerformance(algoId, testData.sorting.arraySize);
          operations = Math.floor(testData.sorting.arraySize * (algoId.includes('Sort') ? 2 : 1));
          memory = testData.sorting.arraySize * (algoId === 'mergeSort' ? 2 : 1);
          break;
        case 'searching':
          executionTime = simulateSearchingPerformance(algoId, testData.searching.arraySize);
          operations = algoId === 'binarySearch' ? Math.log2(testData.searching.arraySize) : testData.searching.arraySize;
          memory = testData.searching.arraySize;
          break;
        case 'pathfinding':
          executionTime = simulatePathfindingPerformance(algoId);
          operations = 400; // Approximate grid cells
          memory = 600; // Nodes in memory
          break;
        default:
          executionTime = 100;
          operations = 100;
          memory = 100;
      }
      
      newResults[algoId] = {
        executionTime,
        operations,
        memoryUsage: memory,
        efficiency: (100000 / (executionTime * operations)).toFixed(2)
      };
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResults(newResults);
    setIsRunning(false);
  };

  // Simulation functions
  const simulateSortingPerformance = (algorithm, arraySize) => {
    const baseTimes = {
      bubbleSort: arraySize * arraySize * 0.01,
      quickSort: arraySize * Math.log2(arraySize) * 0.5,
      mergeSort: arraySize * Math.log2(arraySize) * 0.6,
      heapSort: arraySize * Math.log2(arraySize) * 0.55,
      insertionSort: arraySize * arraySize * 0.008,
      selectionSort: arraySize * arraySize * 0.009
    };
    return Math.round(baseTimes[algorithm] * (0.8 + Math.random() * 0.4));
  };

  const simulateSearchingPerformance = (algorithm, arraySize) => {
    const baseTimes = {
      binarySearch: Math.log2(arraySize) * 10,
      linearSearch: arraySize * 2
    };
    return Math.round(baseTimes[algorithm] * (0.8 + Math.random() * 0.4));
  };

  const simulatePathfindingPerformance = (algorithm) => {
    const baseTimes = {
      dijkstra: 120,
      aStar: 80,
      bfs: 100,
      dfs: 150
    };
    return Math.round(baseTimes[algorithm] * (0.8 + Math.random() * 0.4));
  };

  const handleAlgorithmToggle = (algorithmId) => {
    if (selectedAlgorithms.includes(algorithmId)) {
      if (selectedAlgorithms.length > 1) {
        setSelectedAlgorithms(selectedAlgorithms.filter(id => id !== algorithmId));
      }
    } else {
      if (selectedAlgorithms.length < 4) {
        setSelectedAlgorithms([...selectedAlgorithms, algorithmId]);
      }
    }
  };

  const getMaxValue = (key) => {
    const values = Object.values(results).map(result => result[key]);
    return Math.max(...values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-indigo-700 p-1 rounded-2xl mb-4">
            <div className="bg-white rounded-2xl px-6 py-2">
              <span className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700">
                Comprehensive Algorithm Analysis
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Algorithm Performance Comparison</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare performance across sorting, searching, and pathfinding algorithms with detailed metrics and visual analysis.
          </p>
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex space-x-4 mb-6">
            {Object.entries(algorithmCategories).map(([categoryKey, category]) => (
              <button
                key={categoryKey}
                onClick={() => {
                  setActiveCategory(categoryKey);
                  setSelectedAlgorithms([Object.keys(category.algorithms)[0]]);
                  setResults({});
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeCategory === categoryKey
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          {/* Algorithm Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Algorithms to Compare (2-4)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(algorithmCategories[activeCategory].algorithms).map(([algoId, algo]) => (
                <button
                  key={algoId}
                  onClick={() => handleAlgorithmToggle(algoId)}
                  disabled={!selectedAlgorithms.includes(algoId) && selectedAlgorithms.length >= 4}
                  className={`p-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedAlgorithms.includes(algoId)
                      ? `bg-gradient-to-r ${algo.gradient} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {algo.name}
                </button>
              ))}
            </div>
          </div>

          {/* Test Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {activeCategory === 'sorting' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Array Size</label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    value={testData.sorting?.arraySize || 100}
                    onChange={(e) => setTestData({
                      ...testData,
                      sorting: { ...testData.sorting, arraySize: parseInt(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{testData.sorting?.arraySize || 100} elements</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Array Type</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-xl"
                    value={testData.sorting?.arrayType || 'random'}
                    onChange={(e) => setTestData({
                      ...testData,
                      sorting: { ...testData.sorting, arrayType: e.target.value }
                    })}
                  >
                    <option value="random">Random</option>
                    <option value="sorted">Sorted</option>
                    <option value="reversed">Reversed</option>
                  </select>
                </div>
              </>
            )}
            
            {activeCategory === 'searching' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Array Size</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={testData.searching?.arraySize || 50}
                    onChange={(e) => setTestData({
                      ...testData,
                      searching: { ...testData.searching, arraySize: parseInt(e.target.value) }
                    })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">{testData.searching?.arraySize || 50} elements</div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Target Value</label>
                  <input
                    type="number"
                    value={testData.searching?.target || 42}
                    onChange={(e) => setTestData({
                      ...testData,
                      searching: { ...testData.searching, target: parseInt(e.target.value) }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
              </>
            )}
            
            {activeCategory === 'pathfinding' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Grid Size</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-xl"
                    value={testData.pathfinding?.gridSize || '20x30'}
                    onChange={(e) => setTestData({
                      ...testData,
                      pathfinding: { ...testData.pathfinding, gridSize: e.target.value }
                    })}
                  >
                    <option value="10x15">Small (10x15)</option>
                    <option value="20x30">Medium (20x30)</option>
                    <option value="30x45">Large (30x45)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Obstacle Density</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-xl"
                    value={testData.pathfinding?.obstacles || '30%'}
                    onChange={(e) => setTestData({
                      ...testData,
                      pathfinding: { ...testData.pathfinding, obstacles: e.target.value }
                    })}
                  >
                    <option value="10%">Low (10%)</option>
                    <option value="30%">Medium (30%)</option>
                    <option value="50%">High (50%)</option>
                  </select>
                </div>
              </>
            )}
            
            <div className="flex items-end">
              <button
                onClick={runComparison}
                disabled={isRunning || selectedAlgorithms.length < 2}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isRunning ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Running Comparison...
                  </div>
                ) : (
                  `Compare ${selectedAlgorithms.length} Algorithms`
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {Object.keys(results).length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Performance Results</h2>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {selectedAlgorithms.map((algoId) => {
                const algo = algorithmCategories[activeCategory].algorithms[algoId];
                const result = results[algoId];
                
                return (
                  <div key={algoId} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${algo.gradient} flex items-center justify-center text-white font-bold text-lg mb-4`}>
                      {algo.name.split(' ').map(word => word[0]).join('')}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{algo.name}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-mono text-purple-600">{result.executionTime}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Operations:</span>
                        <span className="font-mono text-blue-600">{result.operations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Memory:</span>
                        <span className="font-mono text-green-600">{result.memoryUsage} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Efficiency:</span>
                        <span className="font-mono text-orange-600">{result.efficiency}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Comparison */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Performance Comparison</h3>
              <div className="space-y-6">
                {/* Execution Time Chart */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Execution Time (Lower is Better)</h4>
                  <div className="space-y-3">
                    {selectedAlgorithms.map((algoId) => {
                      const algo = algorithmCategories[activeCategory].algorithms[algoId];
                      const result = results[algoId];
                      const maxTime = getMaxValue('executionTime');
                      const width = (result.executionTime / maxTime) * 100;
                      
                      return (
                        <div key={algoId} className="flex items-center">
                          <span className="w-32 font-medium text-gray-700">{algo.name}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${algo.gradient} transition-all duration-1000`}
                              style={{ width: `${width}%` }}
                            ></div>
                          </div>
                          <span className="w-20 text-right font-mono text-sm text-gray-600 ml-3">
                            {result.executionTime}ms
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Efficiency Chart */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Efficiency Score (Higher is Better)</h4>
                  <div className="space-y-3">
                    {selectedAlgorithms.map((algoId) => {
                      const algo = algorithmCategories[activeCategory].algorithms[algoId];
                      const result = results[algoId];
                      const maxEfficiency = getMaxValue('efficiency');
                      const width = (result.efficiency / maxEfficiency) * 100;
                      
                      return (
                        <div key={algoId} className="flex items-center">
                          <span className="w-32 font-medium text-gray-700">{algo.name}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${algo.gradient} transition-all duration-1000`}
                              style={{ width: `${width}%` }}
                            ></div>
                          </div>
                          <span className="w-20 text-right font-mono text-sm text-gray-600 ml-3">
                            {result.efficiency}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Complexity Analysis */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Complexity Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedAlgorithms.map((algoId) => {
                  const algo = algorithmCategories[activeCategory].algorithms[algoId];
                  
                  return (
                    <div key={algoId} className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">{algo.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Best:</span>
                          <span className="font-mono text-green-600">{algo.complexity.best}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average:</span>
                          <span className="font-mono text-yellow-600">{algo.complexity.average}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Worst:</span>
                          <span className="font-mono text-red-600">{algo.complexity.worst}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Space:</span>
                          <span className="font-mono text-blue-600">{algo.complexity.space}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Educational Insights */}
        {Object.keys(results).length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Algorithm Insights</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-purple-700">🏆 Performance Analysis</h4>
                <p className="text-gray-700 mb-4">
                  Based on the test results with {testData[activeCategory]?.arraySize || 'current'} configuration, 
                  here's how the algorithms compare in real-world performance:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Algorithms with better time complexity generally perform faster on larger datasets</li>
                  <li>• Memory usage can be a critical factor in constrained environments</li>
                  <li>• The "best" algorithm depends on your specific use case and data characteristics</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3 text-purple-700">💡 Practical Recommendations</h4>
                <div className="space-y-3">
                  {activeCategory === 'sorting' && (
                    <>
                      <p className="text-gray-700"><strong>Quick Sort</strong>: Best for general-purpose sorting of large datasets</p>
                      <p className="text-gray-700"><strong>Merge Sort</strong>: Ideal when stability is required or for linked lists</p>
                      <p className="text-gray-700"><strong>Insertion Sort</strong>: Excellent for small or nearly sorted arrays</p>
                    </>
                  )}
                  {activeCategory === 'searching' && (
                    <>
                      <p className="text-gray-700"><strong>Binary Search</strong>: Must have sorted data, extremely fast for large datasets</p>
                      <p className="text-gray-700"><strong>Linear Search</strong>: Works on any data, simple to implement</p>
                    </>
                  )}
                  {activeCategory === 'pathfinding' && (
                    <>
                      <p className="text-gray-700"><strong>A* Search</strong>: Best for most pathfinding scenarios with heuristics</p>
                      <p className="text-gray-700"><strong>Dijkstra's</strong>: Guarantees shortest path, good for weighted graphs</p>
                      <p className="text-gray-700"><strong>BFS</strong>: Finds shortest path in unweighted graphs</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmComparison;