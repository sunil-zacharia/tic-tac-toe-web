/**
 * gameLogic.ts
 *
 * Pure functions for Tic-Tac-Toe board state management and turn logic.
 * All functions are side-effect-free and operate on immutable snapshots.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single cell on the board: 'X', 'O', or empty (null). */
export type CellValue = 'X' | 'O' | null;

/** The 3×3 board represented as a flat 9-element array (row-major order).
 *  Index layout:
 *    0 | 1 | 2
 *   ---+---+---
 *    3 | 4 | 5
 *   ---+---+---
 *    6 | 7 | 8
 */
export type Board = [
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
];

/** The active player marker. 'X' always goes first. */
export type Player = 'X' | 'O';

/** Immutable snapshot of the full game state. */
export interface GameState {
  /** Current board contents. */
  readonly board: Board;
  /** Whose turn it is next. */
  readonly isXNext: Player;
  /** The winner if the game is over; null otherwise. */
  readonly winner: Player | null;
  /** True when all cells are filled and there is no winner. */
  readonly isDraw: boolean;
  /** True when the game has ended (winner found or draw). */
  readonly isGameOver: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** All eight winning line combinations (indices into the board array). */
export const WINNING_LINES: readonly [number, number, number][] = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // centre column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left → bottom-right
  [2, 4, 6], // diagonal top-right → bottom-left
];

// ---------------------------------------------------------------------------
// Board initialisation
// ---------------------------------------------------------------------------

/**
 * Returns a fresh, empty 9-cell board (all cells null).
 * Always call this to obtain a board instead of writing the literal directly
 * so the type tuple is correctly inferred.
 */
export function createInitialBoard(): Board {
  return [null, null, null, null, null, null, null, null, null];
}

/**
 * Returns the initial game state: empty board, X goes first, no winner.
 */
export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    isXNext: 'X',
    winner: null,
    isDraw: false,
    isGameOver: false,
  };
}

// ---------------------------------------------------------------------------
// Selectors / queries
// ---------------------------------------------------------------------------

/**
 * Scans the board for a winning combination.
 *
 * @returns The winning player ('X' or 'O'), or null if no winner yet.
 */
export function calculateWinner(board: Board): Player | null {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }
  return null;
}

/**
 * Returns true when every cell is filled and there is no winner.
 * (Must be called *after* calculateWinner returns null.)
 */
export function checkIsDraw(board: Board): boolean {
  return board.every((cell) => cell !== null) && calculateWinner(board) === null;
}

/**
 * Returns the player whose turn it is *after* `currentPlayer` moves.
 */
export function getNextPlayer(currentPlayer: Player): Player {
  return currentPlayer === 'X' ? 'O' : 'X';
}

// ---------------------------------------------------------------------------
// State transition
// ---------------------------------------------------------------------------

/**
 * Applies a move at `index` and returns the resulting GameState.
 *
 * Rules enforced:
 *   1. The index must be in range [0, 8].
 *   2. The target cell must be empty (null).
 *   3. The game must not already be over.
 *
 * If any rule is violated the *current* state is returned unchanged
 * (no mutation, no exception — callers can detect a no-op by reference equality).
 *
 * @param state  - The current game state (never mutated).
 * @param index  - Board cell index [0–8] where the active player places their mark.
 * @returns      A new GameState reflecting the move, or the original state if invalid.
 */
export function applyMove(state: GameState, index: number): GameState {
  // Guard: game already finished
  if (state.isGameOver) return state;

  // Guard: out-of-range index
  if (index < 0 || index > 8) return state;

  // Guard: cell already occupied
  if (state.board[index] !== null) return state;

  // Build new board immutably
  const newBoard = state.board.slice() as Board;
  newBoard[index] = state.isXNext;

  // Derive new derived state
  const winner = calculateWinner(newBoard);
  const draw = winner === null ? checkIsDraw(newBoard) : false;
  const gameOver = winner !== null || draw;

  return {
    board: newBoard,
    // Only advance the turn if the game is still going
    isXNext: gameOver ? state.isXNext : getNextPlayer(state.isXNext),
    winner,
    isDraw: draw,
    isGameOver: gameOver,
  };
}

/**
 * Convenience alias — resets the game to its initial state.
 */
export const resetGame = createInitialGameState;
