/**
 * useGameState.ts
 *
 * React hook that owns the Tic-Tac-Toe game state via useState
 * and exposes a stable API for UI components.
 *
 * All mutation logic is delegated to the pure functions in gameLogic.ts —
 * this hook is purely a React-layer adapter.
 */
'use client';

import { useCallback, useState } from 'react';
import {
  type GameState,
  type Player,
  type CellValue,
  applyMove,
  createInitialGameState,
} from '@/lib/gameLogic';

// ---------------------------------------------------------------------------
// Public interface
// ---------------------------------------------------------------------------

export interface UseGameStateReturn {
  /** The current 9-cell board array. */
  board: GameState['board'];
  /** Whose turn it is ('X' or 'O'). */
  activePlayer: Player;
  /** The winner of the game, or null. */
  winner: Player | null;
  /** True if the game ended in a draw. */
  isDraw: boolean;
  /** True if the game is over (win or draw). */
  isGameOver: boolean;
  /**
   * Place the active player's mark at `index`.
   * No-ops if the cell is occupied or the game is already over.
   */
  makeMove: (index: number) => void;
  /** Reset the board and start a new game. */
  resetGame: () => void;
  /** Read the value of a single cell. */
  getCellValue: (index: number) => CellValue;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * `useGameState` manages the complete Tic-Tac-Toe game lifecycle.
 *
 * Usage:
 * ```tsx
 * const { board, activePlayer, makeMove, resetGame, winner, isDraw } = useGameState();
 * ```
 */
export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);

  /** Apply a move — delegates validation + state transition to applyMove(). */
  const makeMove = useCallback((index: number) => {
    setGameState((current) => applyMove(current, index));
  }, []);

  /** Wipe everything back to the starting state. */
  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
  }, []);

  /** Return the value of a single cell without exposing the full board. */
  const getCellValue = useCallback(
    (index: number): CellValue => gameState.board[index] ?? null,
    [gameState.board],
  );

  return {
    board: gameState.board,
    activePlayer: gameState.isXNext,
    winner: gameState.winner,
    isDraw: gameState.isDraw,
    isGameOver: gameState.isGameOver,
    makeMove,
    resetGame,
    getCellValue,
  };
}
