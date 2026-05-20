import { useState, useEffect } from 'react';
import { getDailyPlayer, evaluateGuess, getGameState, saveGameState, getStats, updateStatsOnEnd } from './utils/gameLogic';
import SearchInput from './components/SearchInput';
import GuessRow from './components/GuessRow';
import ShareModal from './components/ShareModal';
import InfoModal from './components/InfoModal';
import { Trophy, Info } from 'lucide-react';
import clsx from 'clsx';

const MAX_GUESSES = 6;

function App() {
  const [targetPlayer, setTargetPlayer] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [stats, setStats] = useState({ played: 0, won: 0, currentStreak: 0, maxStreak: 0 });
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    // Initialize game
    const dailyTarget = getDailyPlayer();
    setTargetPlayer(dailyTarget);
    
    const savedState = getGameState();
    setGameState(savedState);
    
    const savedStats = getStats();
    setStats(savedStats);

    // If game is already over on load, show modal after a small delay
    if (savedState && savedState.gameStatus !== 'IN_PROGRESS') {
      setTimeout(() => setShowShareModal(true), 500);
    }
  }, []);

  const handleGuess = (player) => {
    if (!gameState || gameState.gameStatus !== 'IN_PROGRESS') return;

    // Prevent duplicate guesses
    if (gameState.guesses.some(g => g.player.ID === player.ID)) {
      return; // Could show a toast here
    }

    const evaluation = evaluateGuess(player, targetPlayer);
    const newGuesses = [...gameState.guesses, evaluation];
    
    let newStatus = 'IN_PROGRESS';
    let won = false;

    if (player.ID === targetPlayer.ID) {
      newStatus = 'WON';
      won = true;
    } else if (newGuesses.length >= MAX_GUESSES) {
      newStatus = 'LOST';
    }

    const newState = {
      ...gameState,
      guesses: newGuesses,
      gameStatus: newStatus
    };

    setGameState(newState);
    saveGameState(newState);

    if (newStatus !== 'IN_PROGRESS') {
      updateStatsOnEnd(won);
      setStats(getStats());
      setTimeout(() => setShowShareModal(true), 1500); // Wait for animations
    }
  };

  if (!gameState || !targetPlayer) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Carregando...</div>;

  const isGameOver = gameState.gameStatus !== 'IN_PROGRESS';
  const remainingGuesses = MAX_GUESSES - gameState.guesses.length;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center py-8 px-4 sm:px-6">
      <header className="w-full max-w-2xl mb-8 flex items-center justify-between">
        <button onClick={() => setShowInfoModal(true)} className="p-2 text-zinc-400 hover:text-white transition-colors">
          <Info className="w-6 h-6" />
        </button>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          VAR DO DIA
        </h1>
        <div className="flex items-center gap-2 text-zinc-300 font-bold bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>{stats.currentStreak}</span>
        </div>
      </header>

      <main className="w-full max-w-2xl flex-1 flex flex-col">
        {/* Search Area */}
        <div className="mb-8 w-full transition-all duration-300">
          {isGameOver ? (
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full max-w-md mx-auto block py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg border border-zinc-700 transition-colors shadow-lg"
            >
              Ver Resultado Final
            </button>
          ) : (
            <div className="flex flex-col items-center">
              <SearchInput onSelect={handleGuess} disabled={isGameOver} />
              <p className="mt-3 text-sm text-zinc-500 font-medium">
                Tentativas restantes: <span className={clsx("font-bold", remainingGuesses <= 2 ? "text-rose-400" : "text-zinc-300")}>{remainingGuesses}</span> de {MAX_GUESSES}
              </p>
            </div>
          )}
        </div>

        {/* Guesses Container */}
        <div className="w-full flex-1 flex flex-col gap-1">
          {gameState.guesses.length > 0 && <GuessRow isHeader />}
          
          {gameState.guesses.map((guess, index) => (
            <GuessRow key={index} guess={guess} />
          ))}

          {/* Empty placeholders for remaining guesses */}
          {!isGameOver && Array.from({ length: remainingGuesses }).map((_, i) => (
            <div key={`empty-${i}`} className="w-full max-w-2xl mx-auto h-16 sm:h-20 bg-zinc-900/50 border border-zinc-800/50 rounded flex items-center justify-center mb-2 opacity-30">
              <span className="text-zinc-600 text-sm font-medium">?</span>
            </div>
          ))}
        </div>
      </main>

      {showShareModal && (
        <ShareModal 
          status={gameState.gameStatus} 
          guesses={gameState.guesses} 
          maxGuesses={MAX_GUESSES}
          targetPlayer={targetPlayer}
          onClose={() => setShowShareModal(false)}
        />
      )}
      
      {showInfoModal && (
        <InfoModal onClose={() => setShowInfoModal(false)} />
      )}
    </div>
  );
}

export default App;
