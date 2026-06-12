/**
 * Square – a single cell on the tic-tac-toe board.
 *
 * @param {{ value: string|null, onClick: () => void, isWinning: boolean }} props
 */
export default function Square({ value, onClick, isWinning }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center justify-center',
        'w-24 h-24 md:w-32 md:h-32',
        'text-4xl md:text-5xl font-bold',
        'border-2 border-gray-400',
        'transition-colors duration-150',
        isWinning
          ? 'bg-yellow-200 text-yellow-800'
          : 'bg-white hover:bg-gray-100',
        value ? 'cursor-default' : 'cursor-pointer',
      ].join(' ')}
      aria-label={value ?? 'empty'}
    >
      {value}
    </button>
  );
}
