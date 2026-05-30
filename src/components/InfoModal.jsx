import { X } from 'lucide-react';

export default function InfoModal({ onClose, gameMode = 'classic' }) {
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
          
          <h2 className="text-2xl font-black mb-4 uppercase tracking-wide text-white">
            Como Jogar
          </h2>
          
          <div className="text-zinc-400 text-sm text-left space-y-4">
            {gameMode === 'classic' ? (
              <>
                <p>Adivinhe o jogador do dia em 6 tentativas.</p>
                <p>Digite o nome de um jogador e aperte Enter. Depois de cada tentativa, as cores mostrarão o quão perto você está do jogador oculto.</p>
                
                <ul className="space-y-2 mt-4">
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-emerald-500 rounded text-white text-xs shrink-0">🟩</span>
                    <span>Verde indica que a propriedade está correta.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-rose-950/80 border border-rose-900/50 rounded text-zinc-200 text-xs shrink-0">🟥</span>
                    <span>Vermelho indica que a propriedade está incorreta.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-rose-950/80 border border-rose-900/50 rounded text-rose-400 text-xs shrink-0">⬆️</span>
                    <span>Na idade, as setas indicam se o jogador é mais velho (⬆️) ou mais novo (⬇️).</span>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <p>Adivinhe o jogador do dia com base na sua trajetória de clubes.</p>
                <p>O jogo revela um clube por vez. Se você errar, o próximo clube da carreira dele é revelado.</p>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">➔</span>
                    <span>Você tem a mesma quantidade de tentativas do número de clubes que o jogador defendeu (no mínimo 6).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">➔</span>
                    <span>A ordem dos escudos pode começar do primeiro time que ele jogou (da esquerda para a direita) ou do seu time atual/último (da direita para a esquerda).</span>
                  </li>
                </ul>
              </>
            )}
            
            <p className="mt-6 text-center text-xs text-zinc-500">
              Um novo jogador estará disponível todos os dias!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
