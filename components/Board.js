import { useState } from 'react';
import Square from './Square';
import { getBoardStatus } from '../lib/gameLogic';

const INITIAL_SQUARES = Array(9).fill(null);

/**
 * Board – manages game state and delegates win/draw evaluation to gameLogic.
 */
export default function Board() {
  const [squares, setSquares] = useState(INITIAL_SQUARES);
  const [isXNext, setIsXNext] = useState(true);

  const { status, winner, winningLine } = getBoardStatus(squares);

  function handleSquareClick(index) {
    // Ignore clicks on filled squares or when the game is already over
    if (squares[index] || status !== 'in_progress') return;

    const nextSquares = squares.slice();
    nextSquares[index] = isXNext ? 'X' : 'O';
    setSquares(nextSquares);
    setIsXNext(!isXNext);
  }

  function handleReset() {
    setSquares(INITIAL_SQUARES);
    setIsXNext(true);
  }

  // Status banner text
  let statusText;
  if (status === 'win') {
    statusText = `🎉 Player ${winner} wins!`;
  } else if (status === 'draw') {
    statusText = "It's a draw!";
  } else {
    statusText = `Player ${isXNext ? 'X' : 'O'}'s turn`;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <h1 className="text-3xl font-bold tracking-tight">Tic-Tac-Toe</h1>

      <p className="text-xl font-semibold" aria-live="polite">
        {statusText}
      </p>

      <div className="grid grid-cols-3 gap-1">
        {squares.map((value, i) => (
          <Square
            key={i}
            value={value}
            onClick={() => handleSquareClick(i)}
            isWinning={winningLine ? winningLine.includes(i) : false}
          />
        ))}
      </div>

      <button
        onClick={handleReset}
        className="mt-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        Restart
      </button>
    </div>
  );
}
