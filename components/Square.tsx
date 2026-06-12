"use client";

interface SquareProps {
  value: "X" | "O" | null;
  onClick: () => void;
  isWinning?: boolean;
}

export default function Square({ value, onClick, isWinning = false }: SquareProps) {
  return (
    <button
      className={[
        "flex items-center justify-center",
        "w-full aspect-square",
        "text-4xl md:text-5xl font-bold",
        "border-2 border-slate-400",
        "rounded-md",
        "transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        isWinning
          ? "bg-indigo-100 text-indigo-700 border-indigo-500"
          : value
          ? "bg-white text-slate-800 hover:bg-slate-50"
          : "bg-white text-slate-800 hover:bg-slate-100 cursor-pointer",
      ].join(" ")}
      onClick={onClick}
      aria-label={value ? `Square: ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}
