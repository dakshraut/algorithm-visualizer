import React, { useState, useEffect, useRef } from 'react';

// Node class to represent each cell in the grid
class Node {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.isStart = false;
    this.isEnd = false;
    this.isWall = false;
    this.isVisited = false;
    this.isPath = false;
    this.distance = Infinity;
    this.totalDistance = Infinity; // For A* algorithm
    this.heuristic = Infinity; // For A* algorithm
    this.previousNode = null;
  }
}

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [startNode, setStartNode] = useState({ row: 10, col: 5 });
  const [endNode, setEndNode] = useState({ row: 10, col: 25 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggingType, setDraggingType] = useState(null);
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [visualizing, setVisualizing] = useState(false);
  const [speed, setSpeed] = useState(3); // Changed to a more intuitive scale: 1-5
  const [message, setMessage] = useState('');
  const timeoutRef = useRef(null);

  // Speed settings (shorter delays for faster visualization)
  const speedSettings = {
    1: { visitedDelay: 50, pathDelay: 100 },   // Slow
    2: { visitedDelay: 25, pathDelay: 50 },    // Medium
    3: { visitedDelay: 10, pathDelay: 25 },    // Normal (default)
    4: { visitedDelay: 5, pathDelay: 10 },     // Fast
    5: { visitedDelay: 1, pathDelay: 5 }       // Very Fast
  };

  // Initialize grid
  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 30; col++) {
        const node = new Node(row, col);
        node.isStart = row === startNode.row && col === startNode.col;
        node.isEnd = row === endNode.row && col === endNode.col;
        currentRow.push(node);
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
    setMessage('Click and drag to create walls. Select an algorithm and click Visualize.');
  };

  const resetGrid = () => {
    const newGrid = grid.map(row => {
      return row.map(node => {
        const newNode = new Node(node.row, node.col);
        newNode.isStart = node.isStart;
        newNode.isEnd = node.isEnd;
        newNode.isWall = node.isWall;
        return newNode;
      });
    });
    setGrid(newGrid);
    setMessage('Grid has been reset. Walls are preserved.');
  };

  const clearWalls = () => {
    const newGrid = grid.map(row => {
      return row.map(node => {
        const newNode = new Node(node.row, node.col);
        newNode.isStart = node.isStart;
        newNode.isEnd = node.isEnd;
        return newNode;
      });
    });
    setGrid(newGrid);
    setMessage('All walls have been cleared.');
  };

  const clearPath = () => {
    const newGrid = grid.map(row => {
      return row.map(node => {
        const newNode = new Node(node.row, node.col);
        newNode.isStart = node.isStart;
        newNode.isEnd = node.isEnd;
        newNode.isWall = node.isWall;
        return newNode;
      });
    });
    setGrid(newGrid);
    setMessage('Path has been cleared.');
  };

  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    
    // Don't allow walls on start or end nodes
    if (node.isStart || node.isEnd) return newGrid;
    
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  const handleMouseDown = (row, col) => {
    if (visualizing) return;
    
    if (grid[row][col].isStart) {
      setIsDragging(true);
      setDraggingType('start');
      return;
    }
    
    if (grid[row][col].isEnd) {
      setIsDragging(true);
      setDraggingType('end');
      return;
    }
    
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setIsDragging(true);
    setDraggingType('wall');
  };

  const handleMouseEnter = (row, col) => {
    if (!isDragging || visualizing) return;
    
    if (draggingType === 'start') {
      const newGrid = grid.slice();
      
      // Reset old start node
      const oldStartNode = newGrid[startNode.row][startNode.col];
      newGrid[startNode.row][startNode.col] = {
        ...oldStartNode,
        isStart: false,
      };
      
      // Set new start node (if not a wall or end node)
      if (!newGrid[row][col].isWall && !newGrid[row][col].isEnd) {
        const newNode = newGrid[row][col];
        newGrid[row][col] = {
          ...newNode,
          isStart: true,
        };
        
        setGrid(newGrid);
        setStartNode({ row, col });
      }
      return;
    }
    
    if (draggingType === 'end') {
      const newGrid = grid.slice();
      
      // Reset old end node
      const oldEndNode = newGrid[endNode.row][endNode.col];
      newGrid[endNode.row][endNode.col] = {
        ...oldEndNode,
        isEnd: false,
      };
      
      // Set new end node (if not a wall or start node)
      if (!newGrid[row][col].isWall && !newGrid[row][col].isStart) {
        const newNode = newGrid[row][col];
        newGrid[row][col] = {
          ...newNode,
          isEnd: true,
        };
        
        setGrid(newGrid);
        setEndNode({ row, col });
      }
      return;
    }
    
    if (draggingType === 'wall') {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingType(null);
  };

  // Helper functions for all algorithms
  const getAllNodes = (grid) => {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  };

  const getUnvisitedNeighbors = (node, grid) => {
    const neighbors = [];
    const { col, row } = node;
    
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    
    return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
  };

  const getNodesInShortestPathOrder = (endNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode = endNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  };

  const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    const { visitedDelay, pathDelay } = speedSettings[speed];
    
    // Animate visited nodes
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      timeoutRef.current = setTimeout(() => {
        const node = visitedNodesInOrder[i];
        setGrid(prevGrid => {
          const newGrid = prevGrid.slice();
          newGrid[node.row][node.col] = {
            ...newGrid[node.row][node.col],
            isVisited: true,
          };
          return newGrid;
        });
      }, visitedDelay * i);
    }
    
    // Animate shortest path after all nodes have been visited
    timeoutRef.current = setTimeout(() => {
      animateShortestPath(nodesInShortestPathOrder);
    }, visitedDelay * visitedNodesInOrder.length);
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    const { pathDelay } = speedSettings[speed];
    
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      timeoutRef.current = setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        setGrid(prevGrid => {
          const newGrid = prevGrid.slice();
          // Skip start and end nodes
          if (!newGrid[node.row][node.col].isStart && !newGrid[node.row][node.col].isEnd) {
            newGrid[node.row][node.col] = {
              ...newGrid[node.row][node.col],
              isPath: true,
            };
          }
          return newGrid;
        });
        
        if (i === nodesInShortestPathOrder.length - 1) {
          setVisualizing(false);
          setMessage(`Path found! Shortest path is ${nodesInShortestPathOrder.length - 1} steps.`);
        }
      }, pathDelay * i);
    }
  };

  // Dijkstra's Algorithm
  const dijkstra = () => {
    setVisualizing(true);
    setMessage('Visualizing Dijkstra\'s Algorithm...');
    
    // Create a deep copy of the grid
    const newGrid = grid.map(row => row.map(node => ({ ...node })));
    const startNodeObj = newGrid[startNode.row][startNode.col];
    startNodeObj.distance = 0;
    
    const visitedNodesInOrder = [];
    const unvisitedNodes = getAllNodes(newGrid);
    
    while (unvisitedNodes.length > 0) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
      
      // If we encounter a wall, skip it
      if (closestNode.isWall) continue;
      
      // If the closest node is at infinity, we're trapped
      if (closestNode.distance === Infinity) {
        setVisualizing(false);
        setMessage('No path found! The end node is unreachable.');
        return;
      }
      
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      
      // If we've reached the end node
      if (closestNode.isEnd) {
        const shortestPath = getNodesInShortestPathOrder(newGrid[endNode.row][endNode.col]);
        animateAlgorithm(visitedNodesInOrder, shortestPath);
        return;
      }
      
      updateUnvisitedNeighbors(closestNode, newGrid);
    }
    
    setVisualizing(false);
    setMessage('No path found! The end node is unreachable.');
  };

  const sortNodesByDistance = (unvisitedNodes) => {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  };

  const updateUnvisitedNeighbors = (node, grid) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  };

  // A* Algorithm
  const aStar = () => {
    setVisualizing(true);
    setMessage('Visualizing A* Algorithm...');
    
    // Create a deep copy of the grid
    const newGrid = grid.map(row => row.map(node => ({ ...node })));
    const startNodeObj = newGrid[startNode.row][startNode.col];
    const endNodeObj = newGrid[endNode.row][endNode.col];
    
    // Initialize start node
    startNodeObj.distance = 0;
    startNodeObj.heuristic = calculateHeuristic(startNodeObj, endNodeObj);
    startNodeObj.totalDistance = startNodeObj.distance + startNodeObj.heuristic;
    
    const visitedNodesInOrder = [];
    const openSet = [startNodeObj];
    
    while (openSet.length > 0) {
      // Sort nodes by total distance (f-score)
      sortNodesByTotalDistance(openSet);
      const currentNode = openSet.shift();
      
      // If we encounter a wall, skip it
      if (currentNode.isWall) continue;
      
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
      
      // If we've reached the end node
      if (currentNode.isEnd) {
        const shortestPath = getNodesInShortestPathOrder(newGrid[endNode.row][endNode.col]);
        animateAlgorithm(visitedNodesInOrder, shortestPath);
        return;
      }
      
      updateNeighborsAStar(currentNode, newGrid, endNodeObj, openSet);
    }
    
    setVisualizing(false);
    setMessage('No path found! The end node is unreachable.');
  };

  const calculateHeuristic = (node, endNode) => {
    // Manhattan distance
    return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
  };

  const sortNodesByTotalDistance = (nodes) => {
    nodes.sort((nodeA, nodeB) => nodeA.totalDistance - nodeB.totalDistance);
  };

  const updateNeighborsAStar = (node, grid, endNode, openSet) => {
    const neighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of neighbors) {
      const tentativeDistance = node.distance + 1;
      
      if (tentativeDistance < neighbor.distance) {
        neighbor.previousNode = node;
        neighbor.distance = tentativeDistance;
        neighbor.heuristic = calculateHeuristic(neighbor, endNode);
        neighbor.totalDistance = neighbor.distance + neighbor.heuristic;
        
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  };

  // Breadth-First Search (BFS)
  const bfs = () => {
    setVisualizing(true);
    setMessage('Visualizing Breadth-First Search...');
    
    // Create a deep copy of the grid
    const newGrid = grid.map(row => row.map(node => ({ ...node })));
    const startNodeObj = newGrid[startNode.row][startNode.col];
    startNodeObj.distance = 0;
    
    const visitedNodesInOrder = [];
    const queue = [startNodeObj];
    
    while (queue.length > 0) {
      const currentNode = queue.shift();
      
      // If we encounter a wall, skip it
      if (currentNode.isWall) continue;
      
      // If we've reached the end node
      if (currentNode.isEnd) {
        const shortestPath = getNodesInShortestPathOrder(newGrid[endNode.row][endNode.col]);
        animateAlgorithm(visitedNodesInOrder, shortestPath);
        return;
      }
      
      if (!currentNode.isVisited) {
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        
        const neighbors = getUnvisitedNeighbors(currentNode, newGrid);
        for (const neighbor of neighbors) {
          if (!neighbor.isVisited && !queue.includes(neighbor)) {
            neighbor.distance = currentNode.distance + 1;
            neighbor.previousNode = currentNode;
            queue.push(neighbor);
          }
        }
      }
    }
    
    setVisualizing(false);
    setMessage('No path found! The end node is unreachable.');
  };

  // Depth-First Search (DFS)
  const dfs = () => {
    setVisualizing(true);
    setMessage('Visualizing Depth-First Search...');
    
    // Create a deep copy of the grid
    const newGrid = grid.map(row => row.map(node => ({ ...node })));
    const startNodeObj = newGrid[startNode.row][startNode.col];
    startNodeObj.distance = 0;
    
    const visitedNodesInOrder = [];
    const stack = [startNodeObj];
    
    while (stack.length > 0) {
      const currentNode = stack.pop();
      
      // If we encounter a wall, skip it
      if (currentNode.isWall) continue;
      
      // If we've reached the end node
      if (currentNode.isEnd) {
        const shortestPath = getNodesInShortestPathOrder(newGrid[endNode.row][endNode.col]);
        animateAlgorithm(visitedNodesInOrder, shortestPath);
        return;
      }
      
      if (!currentNode.isVisited) {
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        
        const neighbors = getUnvisitedNeighbors(currentNode, newGrid);
        for (const neighbor of neighbors) {
          if (!neighbor.isVisited && !stack.includes(neighbor)) {
            neighbor.distance = currentNode.distance + 1;
            neighbor.previousNode = currentNode;
            stack.push(neighbor);
          }
        }
      }
    }
    
    setVisualizing(false);
    setMessage('No path found! The end node is unreachable.');
  };

  const runAlgorithm = () => {
    if (visualizing) return;
    
    switch (algorithm) {
      case 'dijkstra':
        dijkstra();
        break;
      case 'aStar':
        aStar();
        break;
      case 'bfs':
        bfs();
        break;
      case 'dfs':
        dfs();
        break;
      default:
        dijkstra();
    }
  };

  const stopAlgorithm = () => {
    setVisualizing(false);
    setMessage('Visualization stopped.');
    clearTimeout(timeoutRef.current);
  };

  const getAlgorithmName = () => {
    switch (algorithm) {
      case 'dijkstra': return 'Dijkstra\'s Algorithm';
      case 'aStar': return 'A* Search';
      case 'bfs': return 'Breadth-First Search';
      case 'dfs': return 'Depth-First Search';
      default: return 'Dijkstra\'s Algorithm';
    }
  };

  const getAlgorithmDescription = () => {
    switch (algorithm) {
      case 'dijkstra': return 'Finds the shortest path between nodes in a graph by expanding the least-cost node first. Guarantees the shortest path.';
      case 'aStar': return 'Uses heuristics to guide the search towards the goal, making it more efficient than Dijkstra\'s algorithm. Guarantees the shortest path.';
      case 'bfs': return 'Explores all nodes at the present depth before moving on to nodes at the next depth level. Guarantees the shortest path in unweighted graphs.';
      case 'dfs': return 'Explores as far as possible along each branch before backtracking. Does not guarantee the shortest path.';
      default: return 'Finds the shortest path between nodes in a graph by expanding the least-cost node first. Guarantees the shortest path.';
    }
  };

  const getTimeComplexity = () => {
    switch (algorithm) {
      case 'dijkstra': return { time: 'O((V+E) log V)', space: 'O(V)' };
      case 'aStar': return { time: 'O((V+E) log V)', space: 'O(V)' };
      case 'bfs': return { time: 'O(V+E)', space: 'O(V)' };
      case 'dfs': return { time: 'O(V+E)', space: 'O(V)' };
      default: return { time: 'O((V+E) log V)', space: 'O(V)' };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Pathfinding Algorithm Visualizer</h1>
      
      {/* Status Message */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl text-center shadow">
        <div className="text-lg font-semibold text-blue-800">
          {message}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">{getAlgorithmName()}</h2>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={runAlgorithm}
              disabled={visualizing}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Visualize
            </button>
            <button
              onClick={stopAlgorithm}
              disabled={!visualizing}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5a2 2 0 11-4 0 2 2 0 014 0zM12 5h6M12 9h6M12 13h4"></path>
              </svg>
              Stop
            </button>
            <button
              onClick={clearWalls}
              disabled={visualizing}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"></path>
              </svg>
              Clear Walls
            </button>
            <button
              onClick={clearPath}
              disabled={visualizing}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Clear Path
            </button>
            <button
              onClick={initializeGrid}
              disabled={visualizing}
              className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-xl hover:from-gray-600 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              New Grid
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={visualizing}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="dijkstra">Dijkstra's Algorithm</option>
              <option value="aStar">A* Search</option>
              <option value="bfs">Breadth-First Search</option>
              <option value="dfs">Depth-First Search</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Speed</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              disabled={visualizing}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="1">Slow</option>
              <option value="2">Medium</option>
              <option value="3">Normal</option>
              <option value="4">Fast</option>
              <option value="5">Very Fast</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mb-8 overflow-auto">
        <div
          onMouseLeave={handleMouseUp}
          className="inline-block border-2 border-gray-300 rounded-xl"
        >
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="flex">
              {row.map((node, nodeIdx) => {
                const { isStart, isEnd, isWall, isVisited, isPath } = node;
                
                let backgroundColor = 'bg-white';
                if (isStart) backgroundColor = 'bg-green-500';
                else if (isEnd) backgroundColor = 'bg-red-500';
                else if (isWall) backgroundColor = 'bg-gray-800';
                else if (isPath) backgroundColor = 'bg-yellow-400';
                else if (isVisited) backgroundColor = 'bg-blue-300';
                
                return (
                  <div
                    key={nodeIdx}
                    className={`w-5 h-5 border border-gray-200 ${backgroundColor} transition-colors duration-200`}
                    onMouseDown={() => handleMouseDown(rowIdx, nodeIdx)}
                    onMouseEnter={() => handleMouseEnter(rowIdx, nodeIdx)}
                    onMouseUp={handleMouseUp}
                    title={`Row: ${rowIdx}, Col: ${nodeIdx}`}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Legend</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 mr-2 border border-gray-300 rounded"></div>
            <span className="text-sm">Start Node</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-500 mr-2 border border-gray-300 rounded"></div>
            <span className="text-sm">End Node</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-800 mr-2 border border-gray-300 rounded"></div>
            <span className="text-sm">Wall Node</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-300 mr-2 border border-gray-300 rounded"></div>
            <span className="text-sm">Visited Node</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-400 mr-2 border border-gray-300 rounded"></div>
            <span className="text-sm">Shortest Path Node</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white mr-2 border border-gray-300 rounded"></div>
            <span className="text-sm">Unvisited Node</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{getAlgorithmName()}</h2>
        <p className="text-gray-700 mb-6">
          {getAlgorithmDescription()}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="font-bold text-gray-800">Time Complexity</div>
            <div className="text-blue-600 font-semibold">{getTimeComplexity().time}</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="font-bold text-gray-800">Space Complexity</div>
            <div className="text-purple-600 font-semibold">{getTimeComplexity().space}</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <h3 className="font-semibold text-purple-800 mb-2">Instructions</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Drag the <span className="bg-green-500 text-white px-1 rounded">start</span> (green) and <span className="bg-red-500 text-white px-1 rounded">end</span> (red) nodes to move them</li>
            <li>Click on cells to add/remove <span className="bg-gray-800 text-white px-1 rounded">walls</span> (black)</li>
            <li>Select an algorithm and click <span className="bg-green-600 text-white px-1 rounded">Visualize</span> to see it in action</li>
            <li>Use <span className="bg-blue-600 text-white px-1 rounded">Clear Walls</span> to remove all walls</li>
            <li>Use <span className="bg-yellow-600 text-white px-1 rounded">Clear Path</span> to remove the current path</li>
            <li>Use <span className="bg-gray-600 text-white px-1 rounded">New Grid</span> to create a completely new grid</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PathfindingVisualizer;