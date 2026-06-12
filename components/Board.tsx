"use client";

import { useState } from "react";
import Square from "./Square";

type SquareValue = "X" | "O" | null;

function calculateWinner(squares: SquareValue[]): {
  winner: SquareValue;
  winningLines: number[];
} | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLines: [a, b, c] };
    }
  }
  return null;
}

export default function Board() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);

  const result = calculateWinner(squares);
  const winner = result?.winner ?? null;
  const winningLines = result?.winningLines ?? [];
  const isDraw = !winner && squares.every(Boolean);

  function handleSquareClick(index: number) {
    if (squares[index] || winner) return;

    const nextSquares = [...squares];
    nextSquares[index] = isXNext ? "X" : "O";
    setSquares(nextSquares);
    setIsXNext(!isXNext);
  }

  function handleRestart() {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  }

  let statusText: string;
  if (winner) {
    statusText = `Winner: ${winner}`;
  } else if (isDraw) {
    statusText = "It's a draw!";
  } else {
    statusText = `Next player: ${isXNext ? "X" : "O"}`;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Status */}
      <p className="text-xl md:text-2xl font-semibold text-slate-700 min-h-[2rem]">
        {statusText}
      </p>

      {/* 3×3 Grid */}
      <div className="grid grid-cols-3 gap-2 w-64 md:w-80 lg:w-96">
        {squares.map((value, index) => (
          <Square
            key={index}
            value={value}
            onClick={() => handleSquareClick(index)}
            isWinning={winningLines.includes(index)}
          />
        ))}
      </div>

      {/* Restart button */}
      <button
        onClick={handleRestart}
        className="mt-2 px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium
                   hover:bg-indigo-700 active:bg-indigo-800
                   transition-colors duration-150
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        Restart
      </button>
    </div>
  );
}
