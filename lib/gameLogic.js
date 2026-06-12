/**
 * All winning line combinations for a 3×3 tic-tac-toe board.
 * Indices correspond to the flat 9-element board array:
 *   0 | 1 | 2
 *   ---------
 *   3 | 4 | 5
 *   ---------
 *   6 | 7 | 8
 */
export const winningLines = [
  // Horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonal
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Checks whether any player has achieved three-in-a-row.
 *
 * @param {(string|null)[]} squares - Flat 9-element array; each cell is 'X', 'O', or null.
 * @returns {{ winner: string, line: number[] } | null}
 *   The winning player ('X' or 'O') and the winning line indices,
 *   or null if there is no winner yet.
 */
export function calculateWinner(squares) {
  for (const line of winningLines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

/**
 * Evaluates the full board state after a move.
 *
 * @param {(string|null)[]} squares - Flat 9-element board array.
 * @returns {{
 *   status: 'win' | 'draw' | 'in_progress',
 *   winner: string | null,
 *   winningLine: number[] | null
 * }}
 */
export function getBoardStatus(squares) {
  const result = calculateWinner(squares);

  if (result) {
    return {
      status: 'win',
      winner: result.winner,
      winningLine: result.line,
    };
  }

  const isDraw = squares.every((cell) => cell !== null);
  if (isDraw) {
    return { status: 'draw', winner: null, winningLine: null };
  }

  return { status: 'in_progress', winner: null, winningLine: null };
}
