import React, { useState, useEffect, useRef } from 'react';

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(20);
  const [sorting, setSorting] = useState(false);
  const [speed, setSpeed] = useState(3); // Changed to match pathfinding scale: 1-5
  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [pivot, setPivot] = useState(null);
  const [arrayType, setArrayType] = useState('random');
  const [sortComplete, setSortComplete] = useState(false);
  const timeoutRef = useRef(null);

  // Speed settings (shorter delays for faster visualization)
  const speedSettings = {
    1: { delay: 100 },   // Slow
    2: { delay: 50 },    // Medium
    3: { delay: 25 },    // Normal (default)
    4: { delay: 10 },     // Fast
    5: { delay: 1 }       // Very Fast
  };

  // Generate array based on selected type
  const generateArray = (size = arraySize, type = arrayType) => {
    const newArray = [];
    
    if (type === 'random') {
      for (let i = 0; i < size; i++) {
        newArray.push(randomIntFromInterval(5, 500));
      }
    } else if (type === 'nearly-sorted') {
      for (let i = 0; i < size; i++) {
        newArray.push(Math.floor((i / size) * 500) + 5);
      }
      for (let i = 0; i < size / 10; i++) {
        const idx1 = randomIntFromInterval(0, size - 1);
        const idx2 = randomIntFromInterval(0, size - 1);
        [newArray[idx1], newArray[idx2]] = [newArray[idx2], newArray[idx1]];
      }
    } else if (type === 'reversed') {
      for (let i = 0; i < size; i++) {
        newArray.push(500 - Math.floor((i / size) * 500) + 5);
      }
    } else if (type === 'few-unique') {
      const uniqueValues = [50, 150, 250, 350, 450];
      for (let i = 0; i < size; i++) {
        newArray.push(uniqueValues[randomIntFromInterval(0, uniqueValues.length - 1)]);
      }
    }
    
    setArray(newArray);
    resetStates();
  };

  const resetStates = () => {
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setPivot(null);
    setSortComplete(false);
    clearTimeout(timeoutRef.current);
    setSorting(false);
  };

  useEffect(() => {
    generateArray();
  }, [arraySize, arrayType]);

  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Algorithms implementation
  const bubbleSort = async () => {
    setSorting(true);
    setSortComplete(false);
    const arr = [...array];
    const n = arr.length;
    let sortedElements = [...sorted];
    const { delay } = speedSettings[speed];
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparing([j, j + 1]);
        
        await new Promise(resolve => 
          timeoutRef.current = setTimeout(resolve, delay)
        );
        
        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          
          await new Promise(resolve => 
            timeoutRef.current = setTimeout(resolve, delay)
          );
        }
      }
      sortedElements.push(n - i - 1);
      setSorted([...sortedElements]);
    }
    sortedElements.push(0);
    setSorted([...sortedElements]);
    setSorting(false);
    setSortComplete(true);
  };

  // Quick Sort Algorithm
  const quickSort = async () => {
    setSorting(true);
    setSortComplete(false);
    const arr = [...array];
    const { delay } = speedSettings[speed];
    await quickSortHelper(arr, 0, arr.length - 1, delay);
    setSorted(Array.from({length: array.length}, (_, i) => i));
    setSorting(false);
    setSortComplete(true);
  };

  const quickSortHelper = async (arr, low, high, delay) => {
    if (low < high) {
      const pi = await partition(arr, low, high, delay);
      await quickSortHelper(arr, low, pi - 1, delay);
      await quickSortHelper(arr, pi + 1, high, delay);
    }
  };

  const partition = async (arr, low, high, delay) => {
    setPivot(high);
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      setComparing([j, high]);
      await new Promise(resolve => 
        timeoutRef.current = setTimeout(resolve, delay)
      );
      
      if (arr[j] < pivot) {
        i++;
        setSwapping([i, j]);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        
        await new Promise(resolve => 
          timeoutRef.current = setTimeout(resolve, delay)
        );
      }
    }
    
    setSwapping([i + 1, high]);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    
    await new Promise(resolve => 
      timeoutRef.current = setTimeout(resolve, delay)
    );
    
    return i + 1;
  };

  // Merge Sort Algorithm
  const mergeSort = async () => {
    setSorting(true);
    setSortComplete(false);
    const arr = [...array];
    const { delay } = speedSettings[speed];
    await mergeSortHelper(arr, 0, arr.length - 1, delay);
    setSorted(Array.from({length: array.length}, (_, i) => i));
    setSorting(false);
    setSortComplete(true);
  };

  const mergeSortHelper = async (arr, l, r, delay) => {
    if (l >= r) return;
    
    const m = Math.floor((l + r) / 2);
    await mergeSortHelper(arr, l, m, delay);
    await mergeSortHelper(arr, m + 1, r, delay);
    await merge(arr, l, m, r, delay);
  };

  const merge = async (arr, l, m, r, delay) => {
    const n1 = m - l + 1;
    const n2 = r - m;
    
    const L = new Array(n1);
    const R = new Array(n2);
    
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    let i = 0, j = 0, k = l;
    
    while (i < n1 && j < n2) {
      setComparing([l + i, m + 1 + j]);
      await new Promise(resolve => 
        timeoutRef.current = setTimeout(resolve, delay)
      );
      
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      
      setArray([...arr]);
      await new Promise(resolve => 
        timeoutRef.current = setTimeout(resolve, delay)
      );
      
      k++;
    }
    
    while (i < n1) {
      arr[k] = L[i];
      setArray([...arr]);
      await new Promise(resolve => 
        timeoutRef.current = setTimeout(resolve, delay)
      );
      i++;
      k++;
    }
    
    while (j < n2) {
      arr[k] = R[j];
      setArray([...arr]);
      await new Promise(resolve => 
        timeoutRef.current = setTimeout(resolve, delay)
      );
      j++;
      k++;
    }
  };

  // Heap Sort Algorithm
  const heapSort = async () => {
    setSorting(true);
    setSortComplete(false);
    const arr = [...array];
    const n = arr.length;
    const { delay } = speedSettings[speed];
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i, delay);
    }
    
    for (let i = n - 1; i > 0; i--) {
      setSwapping([0, i]);
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setArray([...arr]);
      
      await new Promise(resolve => 
        timeoutRef.current = setTimeout(resolve, delay)
      );
      
      await heapify(arr, i, 0, delay);
    }
    
    setSorted(Array.from({length: array.length}, (_, i) => i));
    setSorting(false);
    setSortComplete(true);
  };

  const heapify = async (arr, n, i, delay) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n) {
      setComparing([left, largest]);
      await new Promise(resolve => 
        timeoutRef.current = setTimeout(resolve, delay)
      );
      
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }
    
    if (right < n) {
      setComparing([right, largest]);
      await new Promise(resolve => 
        timeoutRef.current = setTimeout(resolve, delay)
      );
      
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }
    
    if (largest !== i) {
      setSwapping([i, largest]);
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      
      await new Promise(resolve => 
        timeoutRef.current = setTimeout(resolve, delay)
      );
      
      await heapify(arr, n, largest, delay);
    }
  };

  // Insertion Sort Algorithm
  const insertionSort = async () => {
    setSorting(true);
    setSortComplete(false);
    const arr = [...array];
    const n = arr.length;
    let sortedElements = [...sorted];
    const { delay } = speedSettings[speed];
    
    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      
      sortedElements.push(i);
      setSorted([...sortedElements]);
      
      while (j >= 0 && arr[j] > key) {
        setComparing([j, j + 1]);
        await new Promise(resolve => 
          timeoutRef.current = setTimeout(resolve, delay)
        );
        
        arr[j + 1] = arr[j];
        setArray([...arr]);
        
        await new Promise(resolve => 
          timeoutRef.current = setTimeout(resolve, delay)
        );
        
        j--;
      }
      
      arr[j + 1] = key;
      setArray([...arr]);
    }
    
    setSorted(Array.from({length: array.length}, (_, i) => i));
    setSorting(false);
    setSortComplete(true);
  };

  // Selection Sort Algorithm
  const selectionSort = async () => {
    setSorting(true);
    setSortComplete(false);
    const arr = [...array];
    const n = arr.length;
    let sortedElements = [...sorted];
    const { delay } = speedSettings[speed];
    
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      
      for (let j = i + 1; j < n; j++) {
        setComparing([j, minIdx]);
        await new Promise(resolve => 
          timeoutRef.current = setTimeout(resolve, delay)
        );
        
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      
      if (minIdx !== i) {
        setSwapping([i, minIdx]);
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        
        await new Promise(resolve => 
          timeoutRef.current = setTimeout(resolve, delay)
        );
      }
      
      sortedElements.push(i);
      setSorted([...sortedElements]);
    }
    
    sortedElements.push(n - 1);
    setSorted([...sortedElements]);
    setSorting(false);
    setSortComplete(true);
  };

  const runAlgorithm = () => {
    resetStates();
    
    switch (algorithm) {
      case 'bubbleSort':
        bubbleSort();
        break;
      case 'quickSort':
        quickSort();
        break;
      case 'mergeSort':
        mergeSort();
        break;
      case 'heapSort':
        heapSort();
        break;
      case 'insertionSort':
        insertionSort();
        break;
      case 'selectionSort':
        selectionSort();
        break;
      default:
        bubbleSort();
    }
  };

  const stopAlgorithm = () => {
    resetStates();
  };

  const getAlgorithmName = () => {
    switch (algorithm) {
      case 'bubbleSort': return 'Bubble Sort';
      case 'quickSort': return 'Quick Sort';
      case 'mergeSort': return 'Merge Sort';
      case 'heapSort': return 'Heap Sort';
      case 'insertionSort': return 'Insertion Sort';
      case 'selectionSort': return 'Selection Sort';
      default: return 'Bubble Sort';
    }
  };

  const getTimeComplexity = () => {
    switch (algorithm) {
      case 'bubbleSort': return { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Yes' };
      case 'quickSort': return { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: 'No' };
      case 'mergeSort': return { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: 'Yes' };
      case 'heapSort': return { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: 'No' };
      case 'insertionSort': return { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Yes' };
      case 'selectionSort': return { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'No' };
      default: return { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Yes' };
    }
  };

  const getAlgorithmDescription = () => {
    switch (algorithm) {
      case 'bubbleSort': return 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.';
      case 'quickSort': return 'Selects a pivot element and partitions the array around the pivot, then recursively sorts the sub-arrays.';
      case 'mergeSort': return 'Divides the array into halves, recursively sorts them, and then merges the sorted halves.';
      case 'heapSort': return 'Builds a heap from the input array and then repeatedly extracts the maximum element from the heap.';
      case 'insertionSort': return 'Builds the final sorted array one item at a time by inserting each element into its correct position.';
      case 'selectionSort': return 'Repeatedly finds the minimum element from the unsorted part and puts it at the beginning.';
      default: return 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Sorting Algorithm Visualizer</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">{getAlgorithmName()}</h2>
          <div className="flex gap-4">
            <button
              onClick={runAlgorithm}
              disabled={sorting}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Play
            </button>
            <button
              onClick={stopAlgorithm}
              disabled={!sorting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5a2 2 0 11-4 0 2 2 0 014 0zM12 5h6M12 9h6M12 13h4"></path>
              </svg>
              Stop
            </button>
            <button
              onClick={() => generateArray()}
              disabled={sorting}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Shuffle
            </button>
            <button
              onClick={resetStates}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
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
              disabled={sorting}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="bubbleSort">Bubble Sort</option>
              <option value="quickSort">Quick Sort</option>
              <option value="mergeSort">Merge Sort</option>
              <option value="heapSort">Heap Sort</option>
              <option value="insertionSort">Insertion Sort</option>
              <option value="selectionSort">Selection Sort</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Speed</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              disabled={sorting}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="1">Slow</option>
              <option value="2">Medium</option>
              <option value="3">Normal</option>
              <option value="4">Fast</option>
              <option value="5">Very Fast</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Array Size: {arraySize}</label>
            <input
              type="range"
              min="10"
              max="100"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              disabled={sorting}
              className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Array Type</label>
            <select
              value={arrayType}
              onChange={(e) => setArrayType(e.target.value)}
              disabled={sorting}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="random">Random</option>
              <option value="nearly-sorted">Nearly Sorted</option>
              <option value="reversed">Reversed</option>
              <option value="few-unique">Few Unique</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="h-64 flex items-end justify-center gap-px mb-4 bg-gray-100 rounded-lg p-4">
          {array.map((value, idx) => {
            const isComparing = comparing.includes(idx);
            const isSwapping = swapping.includes(idx);
            const isSorted = sorted.includes(idx);
            const isPivot = pivot === idx;
            
            let backgroundColor = 'bg-green-500';
            if (isComparing) backgroundColor = 'bg-yellow-400';
            if (isSwapping) backgroundColor = 'bg-red-500';
            if (isSorted) backgroundColor = 'bg-green-600';
            if (isPivot) backgroundColor = 'bg-purple-500';
            
            return (
              <div
                key={idx}
                className={`${backgroundColor} transition-all duration-300 ease-in-out rounded-t`}
                style={{
                  height: `${value / 5}%`,
                  width: `${100 / arraySize}%`,
                }}
              ></div>
            );
          })}
        </div>
        
        {sortComplete && (
          <div className="text-center py-4 bg-green-100 rounded-lg mb-4">
            <span className="text-green-800 font-semibold">Sorting complete!</span>
          </div>
        )}
        
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
            <span className="text-sm">Normal</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 mr-2 rounded"></div>
            <span className="text-sm">Comparing</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
            <span className="text-sm">Swapping</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 mr-2 rounded"></div>
            <span className="text-sm">Sorted</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 mr-2 rounded"></div>
            <span className="text-sm">Pivot</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{getAlgorithmName()}</h2>
        <p className="text-gray-700 mb-6">
          {getAlgorithmDescription()}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <div className="font-bold text-gray-800">Best</div>
            <div className="text-green-600 font-semibold">{getTimeComplexity().best}</div>
          </div>
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <div className="font-bold text-gray-800">Average</div>
            <div className="text-yellow-600 font-semibold">{getTimeComplexity().average}</div>
          </div>
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <div className="font-bold text-gray-800">Worst</div>
            <div className="text-red-600 font-semibold">{getTimeComplexity().worst}</div>
          </div>
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <div className="font-bold text-gray-800">Space</div>
            <div className="text-blue-600 font-semibold">{getTimeComplexity().space}</div>
          </div>
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <div className="font-bold text-gray-800">Stable</div>
            <div className="text-green-600 font-semibold">{getTimeComplexity().stable}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;