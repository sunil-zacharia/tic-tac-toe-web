import Board from "@/components/Board";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen bg-slate-50 px-4 py-12">
      <h1 className="mb-8 text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
        Tic-Tac-Toe
      </h1>
      <Board />
    </main>
  );
}
