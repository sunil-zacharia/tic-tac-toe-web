/**
 * gameLogic.test.ts
 *
 * Unit tests for the pure game logic functions:
 *   createInitialBoard, createInitialGameState, calculateWinner,
 *   checkIsDraw, getNextPlayer, applyMove, resetGame
 */

import {
  createInitialBoard,
  createInitialGameState,
  calculateWinner,
  checkIsDraw,
  getNextPlayer,
  applyMove,
  resetGame,
  WINNING_LINES,
  type Board,
  type GameState,
} from '@/lib/gameLogic';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a board from a compact 9-char string: 'X', 'O', or '.' for null. */
function boardFrom(spec: string): Board {
  if (spec.length !== 9) throw new Error('spec must be 9 chars');
  return spec.split('').map((c) => (c === 'X' ? 'X' : c === 'O' ? 'O' : null)) as Board;
}

/** Apply a sequence of moves starting from the initial state. */
function playMoves(...indices: number[]): GameState {
  let state = createInitialGameState();
  for (const i of indices) {
    state = applyMove(state, i);
  }
  return state;
}

// ---------------------------------------------------------------------------
// createInitialBoard
// ---------------------------------------------------------------------------

describe('createInitialBoard', () => {
  it('returns an array of exactly 9 cells', () => {
    expect(createInitialBoard()).toHaveLength(9);
  });

  it('initialises every cell to null', () => {
    expect(createInitialBoard().every((c) => c === null)).toBe(true);
  });

  it('returns a new array on every call (no shared reference)', () => {
    const a = createInitialBoard();
    const b = createInitialBoard();
    expect(a).not.toBe(b);
  });
});

// ---------------------------------------------------------------------------
// createInitialGameState
// ---------------------------------------------------------------------------

describe('createInitialGameState', () => {
  it('sets isXNext to "X"', () => {
    expect(createInitialGameState().isXNext).toBe('X');
  });

  it('sets winner to null', () => {
    expect(createInitialGameState().winner).toBeNull();
  });

  it('sets isDraw to false', () => {
    expect(createInitialGameState().isDraw).toBe(false);
  });

  it('sets isGameOver to false', () => {
    expect(createInitialGameState().isGameOver).toBe(false);
  });

  it('board has 9 null cells', () => {
    const { board } = createInitialGameState();
    expect(board).toHaveLength(9);
    expect(board.every((c) => c === null)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// getNextPlayer
// ---------------------------------------------------------------------------

describe('getNextPlayer', () => {
  it('returns "O" when current player is "X"', () => {
    expect(getNextPlayer('X')).toBe('O');
  });

  it('returns "X" when current player is "O"', () => {
    expect(getNextPlayer('O')).toBe('X');
  });
});

// ---------------------------------------------------------------------------
// calculateWinner
// ---------------------------------------------------------------------------

describe('calculateWinner', () => {
  it('returns null for an empty board', () => {
    expect(calculateWinner(createInitialBoard())).toBeNull();
  });

  it('returns null for a board with no winner', () => {
    // X O X / O X O / O X O — draw, no winner
    expect(calculateWinner(boardFrom('XOXOXOOXO'))).toBeNull();
  });

  it.each(WINNING_LINES)(
    'detects X winning via line [%i, %i, %i]',
    (a, b, c) => {
      const board = createInitialBoard();
      board[a] = 'X';
      board[b] = 'X';
      board[c] = 'X';
      expect(calculateWinner(board)).toBe('X');
    },
  );

  it.each(WINNING_LINES)(
    'detects O winning via line [%i, %i, %i]',
    (a, b, c) => {
      const board = createInitialBoard();
      board[a] = 'O';
      board[b] = 'O';
      board[c] = 'O';
      expect(calculateWinner(board)).toBe('O');
    },
  );

  it('does not confuse a mixed line as a win', () => {
    const board = boardFrom('XOX......');
    expect(calculateWinner(board)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// checkIsDraw
// ---------------------------------------------------------------------------

describe('checkIsDraw', () => {
  it('returns false for an empty board', () => {
    expect(checkIsDraw(createInitialBoard())).toBe(false);
  });

  it('returns true for a fully filled board with no winner', () => {
    // X O X / O X O / O X O — classic draw
    expect(checkIsDraw(boardFrom('XOXOXOOXO'))).toBe(true);
  });

  it('returns false when board is full but there IS a winner', () => {
    // X X X / O O X / O X O — X wins (top row), board is full
    expect(checkIsDraw(boardFrom('XXXOOXOXO'))).toBe(false);
  });

  it('returns false when the board is only partially filled', () => {
    expect(checkIsDraw(boardFrom('XO.......'))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// applyMove — valid moves
// ---------------------------------------------------------------------------

describe('applyMove — valid moves', () => {
  it('places "X" on an empty cell (X moves first)', () => {
    const state = applyMove(createInitialGameState(), 4);
    expect(state.board[4]).toBe('X');
  });

  it('switches active player from X to O after first move', () => {
    const state = applyMove(createInitialGameState(), 0);
    expect(state.isXNext).toBe('O');
  });

  it('switches active player from O back to X after second move', () => {
    const state = playMoves(0, 1);
    expect(state.isXNext).toBe('X');
  });

  it('does not mutate the original state board', () => {
    const original = createInitialGameState();
    const originalBoardRef = original.board;
    applyMove(original, 0);
    expect(original.board).toBe(originalBoardRef);
    expect(original.board[0]).toBeNull();
  });

  it('returns a new state object (immutability)', () => {
    const original = createInitialGameState();
    const next = applyMove(original, 0);
    expect(next).not.toBe(original);
    expect(next.board).not.toBe(original.board);
  });

  it('correctly records a sequence of moves for both players', () => {
    // X:0, O:1, X:2, O:3, X:4
    const state = playMoves(0, 1, 2, 3, 4);
    expect(state.board[0]).toBe('X');
    expect(state.board[1]).toBe('O');
    expect(state.board[2]).toBe('X');
    expect(state.board[3]).toBe('O');
    expect(state.board[4]).toBe('X');
  });
});

// ---------------------------------------------------------------------------
// applyMove — invalid / no-op moves
// ---------------------------------------------------------------------------

describe('applyMove — invalid moves (no-op)', () => {
  it('returns the same state reference when cell is already occupied', () => {
    const after1 = applyMove(createInitialGameState(), 0);
    const after2 = applyMove(after1, 0); // attempt to overwrite
    expect(after2).toBe(after1);
  });

  it('does not change the board when cell is already occupied', () => {
    const after1 = applyMove(createInitialGameState(), 0);
    const after2 = applyMove(after1, 0);
    expect(after2.board[0]).toBe('X');
    expect(after2.isXNext).toBe('O'); // turn did NOT advance again
  });

  it('returns same state for out-of-range index (negative)', () => {
    const state = createInitialGameState();
    expect(applyMove(state, -1)).toBe(state);
  });

  it('returns same state for out-of-range index (> 8)', () => {
    const state = createInitialGameState();
    expect(applyMove(state, 9)).toBe(state);
  });

  it('returns same state when game is already over (win)', () => {
    // X wins: 0, 1, 2
    const state = playMoves(0, 3, 1, 4, 2); // X wins top row
    expect(state.isGameOver).toBe(true);
    const attempted = applyMove(state, 8); // empty cell, but game over
    expect(attempted).toBe(state);
  });
});

// ---------------------------------------------------------------------------
// applyMove — win detection via applyMove
// ---------------------------------------------------------------------------

describe('applyMove — win detection', () => {
  it('sets winner to "X" when X completes a row', () => {
    // X: 0,1,2; O: 3,4
    const state = playMoves(0, 3, 1, 4, 2);
    expect(state.winner).toBe('X');
    expect(state.isGameOver).toBe(true);
  });

  it('sets winner to "O" when O completes a column', () => {
    // X: 0,1,2; O: 3,6 then 4,7 then 5,8... simplified:
    // X:0, O:3, X:1, O:6, X:8, O:... wait, we need O to win col 3,6,?
    // O wins col 0: O:0,3,6 — but X goes first so craft carefully
    // X:4, O:0, X:8, O:3, X:2, O:6 — O wins col [0,3,6]
    const state = playMoves(4, 0, 8, 3, 2, 6);
    expect(state.winner).toBe('O');
    expect(state.isGameOver).toBe(true);
  });

  it('sets winner to "X" on diagonal', () => {
    // X: 0,4,8; O: 1,2
    const state = playMoves(0, 1, 4, 2, 8);
    expect(state.winner).toBe('X');
    expect(state.isGameOver).toBe(true);
  });

  it('does not advance the turn after a winning move', () => {
    // After X wins the active player should stay as X (not flip to O)
    const state = playMoves(0, 3, 1, 4, 2);
    expect(state.isXNext).toBe('X'); // frozen at winner
  });
});

// ---------------------------------------------------------------------------
// applyMove — draw detection via applyMove
// ---------------------------------------------------------------------------

describe('applyMove — draw detection', () => {
  it('sets isDraw and isGameOver when the board fills with no winner', () => {
    // Play out: X O X / O X O / O X O
    // Indices:  0 1 2 / 3 4 5 / 6 7 8
    // Moves:    X:0, O:1, X:2, O:4, X:3, O:6, X:5, O:8, X:7
    // Result:   X O X / X O X / O O X — wait, let's verify:
    // 0=X 1=O 2=X 3=X 4=O 5=X 6=O 7=X 8=O
    // rows: XOX XOX OXO — no win row. cols: XXO OOX XOX — no win col.
    // diags: X O O (0,4,8) — no. X O O (2,4,6) — no. → draw ✓
    const state = playMoves(0, 1, 2, 4, 3, 6, 5, 8, 7);
    expect(state.isDraw).toBe(true);
    expect(state.isGameOver).toBe(true);
    expect(state.winner).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// resetGame
// ---------------------------------------------------------------------------

describe('resetGame', () => {
  it('is identical to createInitialGameState()', () => {
    const fromReset = resetGame();
    const fromCreate = createInitialGameState();
    expect(fromReset).toEqual(fromCreate);
  });

  it('produces a fresh state independent of previous play', () => {
    const played = playMoves(0, 1, 4, 2, 8); // X wins
    expect(played.isGameOver).toBe(true);
    const fresh = resetGame();
    expect(fresh.isGameOver).toBe(false);
    expect(fresh.winner).toBeNull();
    expect(fresh.board.every((c) => c === null)).toBe(true);
  });
});
