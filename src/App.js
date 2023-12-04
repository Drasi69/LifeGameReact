'use client'

import './App.css';
import { useState, useEffect } from 'react';

export default function Home() {
  const maxCol = 12;
  const maxRow = 6;
  const [world, setWorld] = useState(Array(maxRow).fill(null).map(row => new Array(maxCol).fill(null)));
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {

    function play() {
      const nextWorld = world.slice();
      let isModified = false;
      let n = 0;
      let deads = [];
      let lives = [];
  
      for (let row = 0; row < maxRow; row++) {
        for (let col = 0; col < maxCol; col++) {
          n = getNeighbours(row, col);
          if (!nextWorld[row][col] && n === 3) {
            lives.push(new Point(row, col));
          } else if (nextWorld[row][col] === 'X' && (n < 2 || n > 3)) {
            deads.push(new Point(row, col));
          }
        }
      }
  
      if (lives.length > 0 || deads.length > 0) {
        isModified = true;
      }
  
      for (let i of lives) {
        nextWorld[i.getX()][i.getY()] = 'X';
      }
  
      for (let i of deads) {
        nextWorld[i.getX()][i.getY()] = null;
      }
  
      if (isModified) {
        handlePlay(nextWorld);
      }
    }

    function getNeighbours(row, col) {
      let num = 0;
  
      if (row > 0)
      {
          if (col > 0)
          {
              if (world[row-1][col-1])
                  num++;
          }
          if (world[row-1][col])
              num++;
          if (col < maxCol - 1)
          {
              if (world[row-1][col+1])
                  num++;
          }
      }
      if (col > 0)
      {
          if (world[row][col - 1])
              num++;
      }
      if (col < maxCol - 1)
      {
          if (world[row][col + 1])
              num++;
      }
      if (row < maxRow - 1)
      {
          if (col > 0)
          {
              if (world[row + 1][col - 1])
                  num++;
          }
          if (world[row + 1][col])
              num++;
          if (col < maxCol - 1)
          {
              if (world[row + 1][col + 1])
                  num++;
          }
      }
  
      return num;
    }
  
    if (isRunning) {
      let timer = setTimeout(() => {
        play();
      }, 1000);

      return () => clearTimeout(timer)
    }

  }, [world, isRunning]);

  function loadWorld() {
    const nextWorld = world.slice();
    nextWorld[0][1] = 'X';
    nextWorld[0][2] = 'X';
    nextWorld[1][1] = 'X';
    nextWorld[1][4] = 'X';
    handlePlay(nextWorld);
  }

  function start() {
    console.log("start");
    loadWorld();
    setIsRunning(true);
  }

  function stop() {
    setIsRunning(false);
  }

  function handlePlay(currentWorld) {
    setWorld(currentWorld);
  }

  return (
    <main>
      <div className="full-width">
        <h1>LifeGame</h1>
      </div>
      <div className="board">
        <Board world={world} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className='button-3' onClick={() => start()}>Start</button>
        <button className='button-3' onClick={() => stop()}>Stop</button>
      </div>
    </main>
  )
}

function Board({world, onPlay}) {

  function click(row, col) {
    console.log( row + ', ' + col);

    const nextWorld = world.slice();

    nextWorld[row][col] = 'X';

    onPlay(nextWorld);
  }

  console.log('Board:');
  console.log(world);

  return (
    <div className="board">
      {world.map((item, index) => {
        const key = index * 100 + 100;
        return (
          <div className="board-row" key={key}>
            {item.map((subItem, sIndex) => {
              const key = (index * 10) + sIndex;
              return ( <Square val={subItem} key={key} click={() => click(index, sIndex)} /> );
            })}
          </div>
        );
      })}
    </div>
  );
}

function Square({ val, click }) {
  return (
    <button className="square" onClick={click}>
      {val}
    </button>
  );
}

class Point {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  setX(x) {
    this.x = x;
  }

  getX() {
    return this.x;
  }

  setY(y) {
    this.y = y;
  }

  getY() {
    return this.y;
  }
}
