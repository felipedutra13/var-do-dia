import { ArrowUp, ArrowDown } from 'lucide-react';
import clsx from 'clsx';

export default function GuessRow({ guess, isHeader = false }) {
  if (isHeader) {
    return (
      <div className="flex w-full max-w-2xl mx-auto gap-1 sm:gap-2 mb-2 pb-2 border-b border-zinc-800 text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center">
        <div className="w-16 sm:w-20 shrink-0">Jogador</div>
        <div className="flex-1 min-w-0">Nac.</div>
        <div className="flex-1 min-w-0">Liga</div>
        <div className="flex-1 min-w-0">Time</div>
        <div className="flex-1 min-w-0">Pos.</div>
        <div className="flex-1 min-w-0">Idade</div>
      </div>
    );
  }

  const { player, nacionalidade, liga, time, posicao, idade } = guess;

  const getBgClass = (status) => {
    return status === 'correct' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-rose-950/80 border-rose-900/50 text-zinc-200';
  };

  const animationClass = "animate-[flipIn_0.6s_ease-out_forwards] origin-center opacity-0";

  return (
    <div className="flex w-full max-w-2xl mx-auto gap-1 sm:gap-2 mb-2 text-xs sm:text-sm text-center">
      <div className={clsx("w-16 sm:w-20 shrink-0 h-16 sm:h-20 flex flex-col items-center justify-center bg-zinc-800 border border-zinc-700 rounded shadow-sm overflow-hidden px-1 py-1", animationClass)} style={{ animationDelay: '0ms' }}>
        <img src={player.card} alt={player.Name} className="w-8 sm:w-10 h-8 sm:h-10 object-contain mb-0.5" />
        <span className="truncate w-full text-[9px] sm:text-[10px] leading-tight font-medium text-zinc-200" title={player.Name}>{player.Name}</span>
      </div>

      <div className={clsx("flex-1 min-w-0 h-16 sm:h-20 flex items-center justify-center border rounded shadow-sm px-1", getBgClass(nacionalidade), animationClass)} style={{ animationDelay: '200ms' }}>
        <span className="truncate w-full text-[10px] sm:text-xs leading-tight">{player.Nation}</span>
      </div>

      <div className={clsx("flex-1 min-w-0 h-16 sm:h-20 flex items-center justify-center border rounded shadow-sm px-1", getBgClass(liga), animationClass)} style={{ animationDelay: '400ms' }}>
        <span className="truncate w-full text-[10px] sm:text-xs leading-tight line-clamp-2">{player.League}</span>
      </div>

      <div className={clsx("flex-1 min-w-0 h-16 sm:h-20 flex items-center justify-center border rounded shadow-sm px-1", getBgClass(time), animationClass)} style={{ animationDelay: '600ms' }}>
        <span className="truncate w-full text-[10px] sm:text-xs leading-tight line-clamp-2">{player.Team}</span>
      </div>

      <div className={clsx("flex-1 min-w-0 h-16 sm:h-20 flex items-center justify-center border rounded shadow-sm px-1", getBgClass(posicao), animationClass)} style={{ animationDelay: '800ms' }}>
        <span className="truncate w-full text-[10px] sm:text-xs leading-tight">{player.Position}</span>
      </div>

      <div className={clsx("flex-1 min-w-0 h-16 sm:h-20 flex items-center justify-center border rounded shadow-sm px-1 relative", getBgClass(idade.status), animationClass)} style={{ animationDelay: '1000ms' }}>
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm sm:text-base font-bold">{player.Age}</span>
          {idade.status === 'incorrect' && idade.direction === 'up' && (
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 mt-0.5" />
          )}
          {idade.status === 'incorrect' && idade.direction === 'down' && (
            <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 mt-0.5" />
          )}
        </div>
      </div>
    </div>
  );
}
