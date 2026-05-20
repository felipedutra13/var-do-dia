import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getAllPlayers } from '../utils/gameLogic';
import clsx from 'clsx';

const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

export default function SearchInput({ onSelect, disabled }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const players = getAllPlayers();

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length > 0) {
      const normalizedQuery = normalizeString(value);
      const filtered = players.filter(player => 
        normalizeString(player.Name).includes(normalizedQuery)
      );
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (player) => {
    onSelect(player);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto z-10">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input
          type="text"
          className={clsx(
            "block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-lg leading-5 bg-zinc-900 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-shadow",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          placeholder="Adivinhe um jogador..."
          value={query}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-zinc-800 border border-zinc-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {suggestions.map((player) => (
            <li
              key={player.ID}
              onClick={() => handleSelect(player)}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-zinc-700 text-zinc-100 flex items-center gap-3 transition-colors"
            >
              <img src={player.card} alt={player.Name} className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded bg-zinc-800" />
              <div className="flex flex-col">
                <span className="font-medium">{player.Name}</span>
                <span className="text-xs text-zinc-400">{player.Team} • {player.League}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
