import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import './OfficeEscapeGame.css';

const OfficeEscapeGame = () => {
  const mountRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState([
    { name: 'Mark S.', score: 2500 },
    { name: 'Helly R.', score: 2100 },
    { name: 'Irving B.', score: 1950 },
    { name: 'Dylan G.', score: 1800 },
  ]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  useEffect(() => {
    // Game variables
    let scene, camera, renderer, player, milcheeks;
    let maze = [];
    let animationId;
    let scoreInterval;
    let playerSpeed = 0.1;
    let milcheeksSpeed = 0.08;
    let chaseModeActive = false;
    
    // Office worker colors (Severance-inspired muted tones)
    const severanceColors = {
      walls: 0xf5f5f5,
      floor: 0xe0e0e0,
      ceiling: 0xf0f0f0,
      furniture: 0xd0d0d0,
      accent: 0x2c3e50,
      blackHallway: 0x111111
    };
    
    // Initialize game
    const init = () => {
      // Create scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(severanceColors.walls);
      
      // Create camera
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.y = 1.6; // Eye level
      
      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      mountRef.current.appendChild(renderer.domElement);
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 20, 15);
      directionalLight.castShadow = true;
      scene.add(directionalLight);
      
      // Player setup
      player = createPlayer();
      scene.add(player);
      
      // Mr. Milcheeks setup
      milcheeks = createMilcheeks();
      scene.add(milcheeks);
      
      // Create maze
      createMaze();
      
      // Add coworkers
      addCoworkers();
      
      // Start scoring
      scoreInterval = setInterval(() => {
        setScore(prevScore => prevScore + 10);
      }, 1000);
      
      // Event listeners
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', handleResize);
      
      // Start animation loop
      animate();
    };
    
    // Player creation
    const createPlayer = () => {
      const playerGroup = new THREE.Group();
      
      // Body
      const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1, 8);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: severanceColors.accent });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.5;
      playerGroup.add(body);
      
      // Head
      const headGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const headMaterial = new THREE.MeshLambertMaterial({ color: 0xf1c27d });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 1.2;
      playerGroup.add(head);
      
      // Office attire (simplified tie)
      const tieGeometry = new THREE.BoxGeometry(0.05, 0.4, 0.05);
      const tieMaterial = new THREE.MeshLambertMaterial({ color: 0x2980b9 });
      const tie = new THREE.Mesh(tieGeometry, tieMaterial);
      tie.position.set(0, 0.7, 0.2);
      playerGroup.add(tie);
      
      playerGroup.position.set(1.5, 0, 1.5);
      return playerGroup;
    };
    
    // Mr. Milcheeks creation
    const createMilcheeks = () => {
      const milcheeksGroup = new THREE.Group();
      
      // Body
      const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.1, 8);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.55;
      milcheeksGroup.add(body);
      
      // Head
      const headGeometry = new THREE.SphereGeometry(0.22, 16, 16);
      const headMaterial = new THREE.MeshLambertMaterial({ color: 0x5c4033 });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 1.3;
      milcheeksGroup.add(head);
      
      // Leather suit details
      const suitDetailGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.4);
      const suitMaterial = new THREE.MeshLambertMaterial({ color: 0x111111 });
      const suitDetail = new THREE.Mesh(suitDetailGeometry, suitMaterial);
      suitDetail.position.y = 0.7;
      milcheeksGroup.add(suitDetail);
      
      milcheeksGroup.position.set(30, 0, 30); // Start far away
      return milcheeksGroup;
    };
    
    // Create coworker
    const createCoworker = (color, suitColor, position) => {
      const coworkerGroup = new THREE.Group();
      
      // Body
      const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1, 8);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: suitColor });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.5;
      coworkerGroup.add(body);
      
      // Head
      const headGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const headMaterial = new THREE.MeshLambertMaterial({ color });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 1.2;
      coworkerGroup.add(head);
      
      coworkerGroup.position.set(position.x, 0, position.z);
      return coworkerGroup;
    };
    
    // Add coworkers (Mark, Helly, Irving, Dylan)
    const addCoworkers = () => {
      // Mark S.
      const mark = createCoworker(0xf1c27d, 0x2c3e50, { x: 3, z: 3 });
      scene.add(mark);
      
      // Helly R.
      const helly = createCoworker(0xffe4e1, 0x2c3e50, { x: 4, z: 2 });
      scene.add(helly);
      
      // Irving B.
      const irving = createCoworker(0xd2b48c, 0x2c3e50, { x: 2, z: 4 });
      scene.add(irving);
      
      // Dylan G.
      const dylan = createCoworker(0xf1c27d, 0x2c3e50, { x: 3, z: 5 });
      scene.add(dylan);
    };
    
    // Create maze with office, white hallways, and black exit hallway
    const createMaze = () => {
      const mazeSize = 20;
      const wallHeight = 3;
      
      // Initialize empty maze
      for (let i = 0; i < mazeSize; i++) {
        maze[i] = [];
        for (let j = 0; j < mazeSize; j++) {
          maze[i][j] = 1; // 1 = wall
        }
      }
      
      // Create office area (open space)
      for (let i = 1; i < 6; i++) {
        for (let j = 1; j < 6; j++) {
          maze[i][j] = 0; // 0 = open space
        }
      }
      
      // Add office furniture
      addOfficeFurniture();
      
      // Generate maze using Depth-First Search
      generateMaze(6, 6);
      
      // Create exit (black hallway)
      for (let i = mazeSize - 5; i < mazeSize - 1; i++) {
        maze[i][mazeSize - 2] = 2; // 2 = black hallway
      }
      maze[mazeSize - 2][mazeSize - 2] = 3; // 3 = elevator (exit)
      
      // Build the physical maze
      buildMaze();
    };
    
    // Add office furniture
    const addOfficeFurniture = () => {
      // Desks
      for (let i = 0; i < 4; i++) {
        const deskGeometry = new THREE.BoxGeometry(1, 0.5, 0.7);
        const deskMaterial = new THREE.MeshLambertMaterial({ color: severanceColors.furniture });
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.set(2 + i, 0.25, 2 + (i % 2));
        scene.add(desk);
        
        // Computer
        const computerGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.02);
        const computerMaterial = new THREE.MeshLambertMaterial({ color: severanceColors.accent });
        const computer = new THREE.Mesh(computerGeometry, computerMaterial);
        computer.position.set(2 + i, 0.65, 2 + (i % 2));
        scene.add(computer);
      }
      
      // Conference table
      const tableGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 16);
      const tableMaterial = new THREE.MeshLambertMaterial({ color: severanceColors.furniture });
      const table = new THREE.Mesh(tableGeometry, tableMaterial);
      table.position.set(3, 0.05, 4);
      scene.add(table);
    };
    
    // Generate maze using Depth-First Search algorithm
    const generateMaze = (x, y) => {
      const directions = [
        [0, 2], // North
        [2, 0], // East
        [0, -2], // South
        [-2, 0]  // West
      ];
      
      // Shuffle directions
      directions.sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < directions.length; i++) {
        const [dx, dy] = directions[i];
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < maze.length && ny >= 0 && ny < maze[0].length && maze[nx][ny] === 1) {
          maze[nx][ny] = 0;
          maze[x + dx/2][y + dy/2] = 0;
          generateMaze(nx, ny);
        }
      }
    };
    
    // Build physical maze from maze array
    const buildMaze = () => {
      const wallGeometry = new THREE.BoxGeometry(1, 3, 1);
      const whiteWallMaterial = new THREE.MeshLambertMaterial({ color: severanceColors.walls });
      const blackWallMaterial = new THREE.MeshLambertMaterial({ color: severanceColors.blackHallway });
      const floorGeometry = new THREE.PlaneGeometry(maze.length, maze[0].length);
      const floorMaterial = new THREE.MeshLambertMaterial({ color: severanceColors.floor, side: THREE.DoubleSide });
      const ceilingMaterial = new THREE.MeshLambertMaterial({ color: severanceColors.ceiling, side: THREE.DoubleSide });
      
      // Floor
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = Math.PI / 2;
      floor.position.set(maze.length / 2 - 0.5, 0, maze[0].length / 2 - 0.5);
      scene.add(floor);
      
      // Ceiling
      const ceiling = new THREE.Mesh(floorGeometry, ceilingMaterial);
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.set(maze.length / 2 - 0.5, 3, maze[0].length / 2 - 0.5);
      scene.add(ceiling);
      
      // Walls
      for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[0].length; j++) {
          if (maze[i][j] === 1) {
            // Regular wall
            const wall = new THREE.Mesh(wallGeometry, whiteWallMaterial);
            wall.position.set(i, 1.5, j);
            scene.add(wall);
          } else if (maze[i][j] === 2) {
            // Black hallway
            const blackFloor = new THREE.Mesh(
              new THREE.PlaneGeometry(1, 1),
              new THREE.MeshLambertMaterial({ color: severanceColors.blackHallway, side: THREE.DoubleSide })
            );
            blackFloor.rotation.x = Math.PI / 2;
            blackFloor.position.set(i, 0.01, j);
            scene.add(blackFloor);
            
            // Black ceiling
            const blackCeiling = new THREE.Mesh(
              new THREE.PlaneGeometry(1, 1),
              new THREE.MeshLambertMaterial({ color: severanceColors.blackHallway, side: THREE.DoubleSide })
            );
            blackCeiling.rotation.x = Math.PI / 2;
            blackCeiling.position.set(i, 2.99, j);
            scene.add(blackCeiling);
            
            // Black walls
            for (const [dx, dz] of [[0.5, 0], [-0.5, 0], [0, 0.5], [0, -0.5]]) {
              const nx = i + dx;
              const nz = j + dz;
              if (nx < 0 || nx >= maze.length || nz < 0 || nz >= maze[0].length || maze[Math.floor(nx)][Math.floor(nz)] === 1) {
                const blackWall = new THREE.Mesh(
                  new THREE.PlaneGeometry(1, 3),
                  new THREE.MeshLambertMaterial({ color: severanceColors.blackHallway, side: THREE.DoubleSide })
                );
                
                if (dx !== 0) {
                  blackWall.rotation.y = Math.PI / 2;
                }
                
                blackWall.position.set(i + dx/2, 1.5, j + dz/2);
                scene.add(blackWall);
              }
            }
          } else if (maze[i][j] === 3) {
            // Elevator
            const elevatorGeometry = new THREE.BoxGeometry(0.8, 2, 0.8);
            const elevatorMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const elevator = new THREE.Mesh(elevatorGeometry, elevatorMaterial);
            elevator.position.set(i, 1, j);
            scene.add(elevator);
            
            // Elevator doors
            const doorGeometry = new THREE.PlaneGeometry(0.7, 1.8);
            const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x666666, side: THREE.DoubleSide });
            const door = new THREE.Mesh(doorGeometry, doorMaterial);
            door.position.set(i, 1, j - 0.41);
            scene.add(door);
          }
        }
      }
    };
    
    // Handle key presses
    const handleKeyDown = (event) => {
      if (gameOver || gameWon) return;
      
      const speed = playerSpeed;
      const oldX = player.position.x;
      const oldZ = player.position.z;
      let newX = oldX;
      let newZ = oldZ;
      
      switch (event.key.toLowerCase()) {
        case 'w':
          newZ -= speed;
          camera.rotation.y = Math.PI;
          break;
        case 's':
          newZ += speed;
          camera.rotation.y = 0;
          break;
        case 'a':
          newX -= speed;
          camera.rotation.y = Math.PI / 2;
          break;
        case 'd':
          newX += speed;
          camera.rotation.y = -Math.PI / 2;
          break;
        default:
          return;
      }
      
      // Check if new position is valid (not inside a wall)
      const gridX = Math.floor(newX);
      const gridZ = Math.floor(newZ);
      
      if (gridX >= 0 && gridX < maze.length && gridZ >= 0 && gridZ < maze[0].length) {
        if (maze[gridX][gridZ] !== 1) { // Not a wall
          player.position.x = newX;
          player.position.z = newZ;
          camera.position.x = newX;
          camera.position.z = newZ;
          
          // Check if player reached the exit (elevator)
          if (maze[gridX][gridZ] === 3) {
            handleWin();
          }
          
          // Check if player is in the black hallway
          if (maze[gridX][gridZ] === 2) {
            chaseModeActive = true;
          }
        }
      }
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    // Mr. Milcheeks AI
    const updateMilcheeks = () => {
      // Simple chase AI
      if (chaseModeActive) {
        const dx = player.position.x - milcheeks.position.x;
        const dz = player.position.z - milcheeks.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < 0.5) {
          handleGameOver();
          return;
        }
        
        const speed = milcheeksSpeed;
        const angle = Math.atan2(dz, dx);
        
        const newX = milcheeks.position.x + Math.cos(angle) * speed;
        const newZ = milcheeks.position.z + Math.sin(angle) * speed;
        
        // Check if new position is valid (not inside a wall)
        const gridX = Math.floor(newX);
        const gridZ = Math.floor(newZ);
        
        if (gridX >= 0 && gridX < maze.length && gridZ >= 0 && gridZ < maze[0].length) {
          if (maze[gridX][gridZ] !== 1) {
            milcheeks.position.x = newX;
            milcheeks.position.z = newZ;
          } else {
            // Try to move around the wall
            if (Math.random() > 0.5) {
              milcheeks.position.x += dx > 0 ? speed : -speed;
            } else {
              milcheeks.position.z += dz > 0 ? speed : -speed;
            }
          }
        }
      } else if (Math.random() < 0.005) {
        // Random chance to start chase mode
        chaseModeActive = true;
      }
    };
    
    // Animation loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      updateMilcheeks();
      renderer.render(scene, camera);
    };
    
    // Handle game over
    const handleGameOver = () => {
      setGameOver(true);
      clearInterval(scoreInterval);
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
    
    // Handle win
    const handleWin = () => {
      setGameWon(true);
      clearInterval(scoreInterval);
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
    
    // Start the game
    init();
    
    // Cleanup on unmount
    return () => {
      clearInterval(scoreInterval);
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  // Submit score to leaderboard
  const submitScore = () => {
    if (playerName.trim() === '') return;
    
    const newLeaderboard = [...leaderboard, { name: playerName, score }];
    newLeaderboard.sort((a, b) => b.score - a.score);
    
    setLeaderboard(newLeaderboard.slice(0, 10)); // Keep top 10
    setShowLeaderboard(true);
  };
  
  // Restart game
  const restartGame = () => {
    window.location.reload();
  };
  
  return (
    <div className="game-container">
      <div ref={mountRef} className="canvas-container"></div>
      
      {!gameOver && !gameWon && (
        <div className="score-display">
          <p>Score: {score}</p>
          <p>WASD to move</p>
        </div>
      )}
      
      {gameOver && (
        <div className="game-over">
          <h2>CAUGHT BY MR. MILCHEEKS</h2>
          <p>Your Score: {score}</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={submitScore}>Submit Score</button>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
      
      {gameWon && (
        <div className="game-won">
          <h2>YOU ESCAPED!</h2>
          <p>Your Score: {score}</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={submitScore}>Submit Score</button>
          <button onClick={restartGame}>Play Again</button>
        </div>
      )}
      
      {showLeaderboard && (
        <div className="leaderboard">
          <h2>Leaderboard</h2>
          <ul>
            {leaderboard.map((entry, index) => (
              <li key={index}>
                <span>{index + 1}. {entry.name}</span>
                <span>{entry.score}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => setShowLeaderboard(false)}>Close</button>
        </div>
      )}

    </div>
  );
};

export default OfficeEscapeGame;
