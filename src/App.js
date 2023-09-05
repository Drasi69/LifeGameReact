'use client'

import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

export default function Home() {
  const maxCol = 12;
  const maxRow = 6;
  const [world, setWorld] = useState(Array(maxRow).fill(null).map(row => new Array(maxCol).fill(null)));
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      let timer = setTimeout(() => {
        play();
      }, 1000);

      return () => clearTimeout(timer)
    }

  }, [world, isRunning]);

  function play() {
    const nextWorld = world.slice();
    let isModified = false;
    let n: number = 0;
    let deads: Point[] = [];
    let lives: Point[] = [];

    for (var row = 0; row < maxRow; row++) {
      for (var col = 0; col < maxCol; col++) {
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

  function getNeighbours(row: number, col: number): number {
    let num: number = 0;

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
    <main className="game">
      <div className="game-board">
        <h1>LifeGame</h1>
        <Board world={world} setWorld={setWorld} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => start()}>Start</button>
        <button onClick={() => stop()}>Stop</button>
      </div>
    </main>
  )
}

function Board({world, setWorld}) {

  function click(row: number, col: number) {
    console.log( row + ', ' + col);

    const nextWorld = world.slice();

    nextWorld[row][col] = 'X';

    setWorld(nextWorld);
  }

  console.log(world);

  return (
    <div className="grid">
      {world.map((item, index) => {
        return (
          <div className="board-row">
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
  x: number;
  y: number;

  constructor(x: number, y:number) {
    this.x = x;
    this.y = y;
  }

  setX(x: number) {
    this.x = x;
  }

  getX(): number {
    return this.x;
  }

  setY(y: number) {
    this.y = y;
  }

  getY(): number {
    return this.y;
  }
}
