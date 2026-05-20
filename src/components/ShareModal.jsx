import { useState } from 'react';
import { Share2, X, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

export default function ShareModal({ status, guesses, maxGuesses, targetPlayer, onClose }) {
  const [copied, setCopied] = useState(false);

  const generateEmojiGrid = () => {
    return guesses.map(g => {
      const parts = [
        g.nacionalidade === 'correct' ? '🟩' : '🟥',
        g.liga === 'correct' ? '🟩' : '🟥',
        g.time === 'correct' ? '🟩' : '🟥',
        g.posicao === 'correct' ? '🟩' : '🟥',
        g.idade.status === 'correct' ? '🟩' : '🟨'
      ];
      return parts.join('');
    }).join('\n');
  };

  const handleShare = async () => {
    const attempts = status === 'WON' ? guesses.length : 'X';
    const grid = generateEmojiGrid();
    const text = `Var do Dia ${attempts}/${maxGuesses}\n\n${grid}\n\nJogue em: vardodia.com.br`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const isWin = status === 'WON';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="relative p-6 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className={clsx("text-2xl font-black mb-2 uppercase tracking-wide", isWin ? "text-emerald-400" : "text-rose-500")}>
            {isWin ? 'Golaço!' : 'Fim de Jogo'}
          </h2>
          
          <p className="text-zinc-400 mb-6">
            {isWin ? `Você acertou em ${guesses.length} tentativas!` : 'Não foi dessa vez.'}
          </p>

          <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2">O Jogador era</p>
            <div className="flex flex-col items-center justify-center gap-1">
              <p className="font-bold text-lg text-white leading-tight">{targetPlayer.Name}</p>
              <p className="text-sm text-zinc-400">{targetPlayer.Team}</p>
            </div>
          </div>

          <button
            onClick={handleShare}
            className={clsx(
              "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-white transition-all transform active:scale-95",
              copied ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-400"
            )}
          >
            {copied ? (
              'Copiado para a área de transferência!'
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Compartilhar Resultado
              </>
            )}
          </button>

          <div className="mt-6 text-sm text-zinc-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Novo jogador à meia-noite</span>
          </div>
        </div>
      </div>
    </div>
  );
}
