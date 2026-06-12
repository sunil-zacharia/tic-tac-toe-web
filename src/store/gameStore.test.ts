/**
 * gameStore.test.ts
 *
 * Step-05 acceptance tests — 5 explicit scenarios for state management
 * and turn-switching logic:
 *
 *  1. Initial board is all nulls
 *  2. Initial active player is 'X'
 *  3. A valid move places the correct value AND switches the active player
 *  4. A move on an already-occupied cell is rejected (value unchanged, player unchanged)
 *  5. A second valid move places 'O' and switches the active player back to 'X'
 *
 * These tests exercise the pure functions in `lib/gameLogic` (the canonical
 * store of game state) as well as the `useGameState` React hook.
 */

import { renderHook, act } from '@testing-library/react';
import {
  createInitialGameState,
  applyMove,
} from '@/lib/gameLogic';
import { useGameState } from '@/hooks/useGameState';

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 1 — Initial board is all nulls
// ─────────────────────────────────────────────────────────────────────────────

describe('Scenario 1: initial board is all nulls', () => {
  it('every cell of the initial board is null (pure function)', () => {
    const { board } = createInitialGameState();
    expect(board).toHaveLength(9);
    board.forEach((cell, i) => {
      expect(cell).toBeNull(); // cell ${i} should be null
    });
  });

  it('every cell of the initial board is null (React hook)', () => {
    const { result } = renderHook(() => useGameState());
    result.current.board.forEach((cell) => {
      expect(cell).toBeNull();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 2 — Initial active player is 'X'
// ─────────────────────────────────────────────────────────────────────────────

describe("Scenario 2: initial active player is 'X'", () => {
  it("isXNext is 'X' on the initial state (pure function)", () => {
    const { isXNext } = createInitialGameState();
    expect(isXNext).toBe('X');
  });

  it("isXNext is 'X' on mount (React hook)", () => {
    const { result } = renderHook(() => useGameState());
    expect(result.current.isXNext).toBe('X');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 3 — A valid move places the correct value and switches the player
// ─────────────────────────────────────────────────────────────────────────────

describe('Scenario 3: a valid move places the correct value and switches the active player', () => {
  it("places 'X' in cell 4 and switches active player to 'O' (pure function)", () => {
    const before = createInitialGameState();
    const after = applyMove(before, 4);

    expect(after.board[4]).toBe('X');   // correct value written
    expect(after.isXNext).toBe('O');    // player switched
  });

  it("places 'X' in cell 4 and switches active player to 'O' (React hook)", () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.makeMove(4);
    });

    expect(result.current.board[4]).toBe('X');
    expect(result.current.isXNext).toBe('O');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 4 — A move on an already-occupied cell is rejected
// ─────────────────────────────────────────────────────────────────────────────

describe('Scenario 4: a move on an already-occupied cell is rejected', () => {
  it('value is unchanged and player does not switch (pure function)', () => {
    const after1 = applyMove(createInitialGameState(), 4); // X plays cell 4
    const after2 = applyMove(after1, 4);                   // attempt to overwrite cell 4

    expect(after2).toBe(after1);          // same reference — no new state created
    expect(after2.board[4]).toBe('X');    // value unchanged
    expect(after2.isXNext).toBe('O');    // active player did NOT flip again
  });

  it('value is unchanged and player does not switch (React hook)', () => {
    const { result } = renderHook(() => useGameState());

    act(() => { result.current.makeMove(4); }); // X plays cell 4 → O's turn
    const boardAfterFirst = [...result.current.board];
    const playerAfterFirst = result.current.isXNext; // 'O'

    act(() => { result.current.makeMove(4); }); // attempt to overwrite

    expect(result.current.board[4]).toBe('X');             // value still X
    expect(result.current.isXNext).toBe(playerAfterFirst); // still O's turn
    result.current.board.forEach((cell, i) => {
      expect(cell).toBe(boardAfterFirst[i]);               // rest of board untouched
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 5 — A second valid move places 'O' and switches back to 'X'
// ─────────────────────────────────────────────────────────────────────────────

describe("Scenario 5: a second valid move places 'O' and switches active player back to 'X'", () => {
  it("places 'O' in cell 0 on the second move and returns active player to 'X' (pure function)", () => {
    const s0 = createInitialGameState();
    const s1 = applyMove(s0, 4); // X plays 4
    const s2 = applyMove(s1, 0); // O plays 0

    expect(s2.board[4]).toBe('X');  // X's move persists
    expect(s2.board[0]).toBe('O');  // O placed correctly
    expect(s2.isXNext).toBe('X');   // back to X
  });

  it("places 'O' in cell 0 on the second move and returns active player to 'X' (React hook)", () => {
    const { result } = renderHook(() => useGameState());

    act(() => { result.current.makeMove(4); }); // X plays 4
    act(() => { result.current.makeMove(0); }); // O plays 0

    expect(result.current.board[4]).toBe('X');
    expect(result.current.board[0]).toBe('O');
    expect(result.current.isXNext).toBe('X');
  });
});
