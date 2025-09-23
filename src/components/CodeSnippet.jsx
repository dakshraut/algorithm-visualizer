// components/CodeSnippet.jsx
import React, { useState } from 'react';

const CodeSnippet = ({ algorithm }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  
  const codeSnippets = {
    bubbleSort: {
      javascript: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n-1; i++) {
    for (let j = 0; j < n-i-1; j++) {
      if (arr[j] > arr[j+1]) {
        // Swap elements
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  return arr;
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n-1):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
      java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                // Swap elements
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`
    },
    binarySearch: {
      javascript: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}`,
      python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
      java: `public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1;
}`
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Code Implementation</h2>
      
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setSelectedLanguage('javascript')}
          className={`px-3 py-1 rounded ${selectedLanguage === 'javascript' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'}`}
        >
          JavaScript
        </button>
        <button
          onClick={() => setSelectedLanguage('python')}
          className={`px-3 py-1 rounded ${selectedLanguage === 'python' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'}`}
        >
          Python
        </button>
        <button
          onClick={() => setSelectedLanguage('java')}
          className={`px-3 py-1 rounded ${selectedLanguage === 'java' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'}`}
        >
          Java
        </button>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre className="text-green-400 text-sm">
          <code>{codeSnippets[algorithm]?.[selectedLanguage] || '// Select an algorithm to view code'}</code>
        </pre>
      </div>
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Click the buttons above to view the implementation in different programming languages.</p>
      </div>
    </div>
  );
};

export default CodeSnippet;