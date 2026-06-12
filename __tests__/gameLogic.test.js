import { calculateWinner, getBoardStatus, winningLines } from '../lib/gameLogic';

// Helper: build a board from a string of 9 chars ('X', 'O', or '.')
function board(str) {
  return str.split('').map((c) => (c === '.' ? null : c));
}

// ─── calculateWinner ────────────────────────────────────────────────────────

describe('calculateWinner', () => {
  test('returns null for an empty board', () => {
    expect(calculateWinner(Array(9).fill(null))).toBeNull();
  });

  test('returns null for an in-progress board with no winner', () => {
    expect(calculateWinner(board('XO.O.....'))).toBeNull();
  });

  // Horizontal wins
  test.each([
    ['XXX......', 'X', [0, 1, 2]],
    ['...XXX...', 'X', [3, 4, 5]],
    ['......XXX', 'X', [6, 7, 8]],
    ['OOO......', 'O', [0, 1, 2]],
    ['...OOO...', 'O', [3, 4, 5]],
    ['......OOO', 'O', [6, 7, 8]],
  ])('horizontal win: %s → winner %s on line %j', (str, expectedWinner, expectedLine) => {
    const result = calculateWinner(board(str));
    expect(result).not.toBeNull();
    expect(result.winner).toBe(expectedWinner);
    expect(result.line).toEqual(expectedLine);
  });

  // Vertical wins
  test.each([
    ['X..X..X..', 'X', [0, 3, 6]],
    ['.X..X..X.', 'X', [1, 4, 7]],
    ['..X..X..X', 'X', [2, 5, 8]],
    ['O..O..O..', 'O', [0, 3, 6]],
    ['.O..O..O.', 'O', [1, 4, 7]],
    ['..O..O..O', 'O', [2, 5, 8]],
  ])('vertical win: %s → winner %s on line %j', (str, expectedWinner, expectedLine) => {
    const result = calculateWinner(board(str));
    expect(result).not.toBeNull();
    expect(result.winner).toBe(expectedWinner);
    expect(result.line).toEqual(expectedLine);
  });

  // Diagonal wins
  test.each([
    ['X...X...X', 'X', [0, 4, 8]],
    ['..X.X.X..', 'X', [2, 4, 6]],
    ['O...O...O', 'O', [0, 4, 8]],
    ['..O.O.O..', 'O', [2, 4, 6]],
  ])('diagonal win: %s → winner %s on line %j', (str, expectedWinner, expectedLine) => {
    const result = calculateWinner(board(str));
    expect(result).not.toBeNull();
    expect(result.winner).toBe(expectedWinner);
    expect(result.line).toEqual(expectedLine);
  });

  test('returns null for a draw board (no winner)', () => {
    // X O X / O X O / O X O  — draw, no three-in-a-row
    expect(calculateWinner(board('XOXOXOOXO'))).toBeNull();
  });
});

// ─── winningLines ────────────────────────────────────────────────────────────

describe('winningLines', () => {
  test('exports exactly 8 lines', () => {
    expect(winningLines).toHaveLength(8);
  });

  test('every line has exactly 3 valid indices (0-8)', () => {
    winningLines.forEach((line) => {
      expect(line).toHaveLength(3);
      line.forEach((idx) => {
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThanOrEqual(8);
      });
    });
  });
});

// ─── getBoardStatus ──────────────────────────────────────────────────────────

describe('getBoardStatus', () => {
  test('returns in_progress for an empty board', () => {
    expect(getBoardStatus(Array(9).fill(null))).toEqual({
      status: 'in_progress',
      winner: null,
      winningLine: null,
    });
  });

  test('returns in_progress while game is ongoing', () => {
    expect(getBoardStatus(board('XO....X..'))).toEqual({
      status: 'in_progress',
      winner: null,
      winningLine: null,
    });
  });

  test('returns win with correct winner and line when X wins top row', () => {
    expect(getBoardStatus(board('XXXOO....'))).toEqual({
      status: 'win',
      winner: 'X',
      winningLine: [0, 1, 2],
    });
  });

  test('returns win for O winning on a diagonal', () => {
    expect(getBoardStatus(board('..O.O.O..'))).toEqual({
      status: 'win',
      winner: 'O',
      winningLine: [2, 4, 6],
    });
  });

  test('returns draw when board is full with no winner', () => {
    // X O X / O X O / O X O
    expect(getBoardStatus(board('XOXOXOOXO'))).toEqual({
      status: 'draw',
      winner: null,
      winningLine: null,
    });
  });

  test('win takes precedence over full board', () => {
    // X X X / O O X / O X O — top row wins, board is full
    const result = getBoardStatus(board('XXXOOXOXO'));
    expect(result.status).toBe('win');
    expect(result.winner).toBe('X');
  });
});
