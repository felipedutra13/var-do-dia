import React from 'react';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';

function CareerTrajectory({ career, guessesCount, careerDirection }) {
  if (!career || career.length === 0) return null;

  // Always display left→right (earliest → latest)
  const totalClubs = career.length;
  const revealedCount = Math.min(1 + guessesCount, totalClubs);

  const checkRevealed = (index) => {
    if (careerDirection === 'backward') {
      // Reveal from the right (current club first)
      return index >= totalClubs - revealedCount;
    }
    // Reveal from the left (first club first)
    return index < revealedCount;
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/60 shadow-inner">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          Trajetória do Jogador
        </h3>
        <span className="text-xs font-semibold px-2 py-1 bg-zinc-800 rounded text-zinc-500">
          {totalClubs} Clubes
        </span>
      </div>

      <div className={clsx(
        'flex flex-wrap items-center justify-center gap-3 sm:gap-4 relative',
        'flex-row'
      )}>
        {career.map((club, index) => {
          const isRevealed = checkRevealed(index);
          return (
            <React.Fragment key={`${club.team}-${index}`}>
              <div
                className={clsx(
                  'w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center p-2 border-2 transition-all duration-500',
                  isRevealed
                    ? 'bg-zinc-800 border-zinc-600 shadow-lg'
                    : 'bg-zinc-900 border-dashed border-zinc-700 opacity-50'
                )}
                title={isRevealed ? club.team : 'Clube Oculto'}
              >
                {isRevealed ? (
                  <img
                    src={club.logo}
                    alt={club.team}
                    crossOrigin="anonymous"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    className="w-full h-full object-contain filter drop-shadow-md animate-in fade-in zoom-in duration-300"
                  />
                ) : (
                  <span className="text-zinc-600 font-bold text-xl">?</span>
                )}
              </div>

                {index < totalClubs - 1 && (
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700" />
                )}
            </React.Fragment>
          );
        })}
      </div>

      <p className="text-center text-xs text-zinc-500 mt-4">
        {careerDirection === 'forward'
          ? 'Revelando a partir do primeiro clube.'
          : 'Revelando a partir do clube atual.'}
      </p>
    </div>
  );
}

export default CareerTrajectory;
