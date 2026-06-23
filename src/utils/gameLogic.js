import players from '../data/players.json';
import brazillianPlayers from '../data/brazillian_players.json';

// Utility to generate a pseudo-random number from a string
const seededRandom = (seed) => {
  let h = 0xdeadbeef, i = 0;
  for (i = 0; i < seed.length; i++)
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  return ((h ^ h >>> 16) >>> 0) / 4294967296;
};

export const getDailyPlayer = (mode = 'mundial') => {
  const today = new Date();
  
  if (mode === 'brasileirao') {
    // Sequential selection logic starting from June 22, 2026
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const startMidnight = new Date(2026, 5, 22).getTime(); // Note: Month is 0-indexed (5 = June)
    
    let diffDays = Math.floor((todayMidnight - startMidnight) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) diffDays = 0;
    
    const index = diffDays % brazillianPlayers.length;
    return brazillianPlayers[index];
  } else {
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-v4-SaltDoVarDoDia!`;
    const randomValue = seededRandom(dateString);
    const top100Players = players.filter(p => p.Rank <= 100);
    const index = Math.floor(randomValue * top100Players.length);
    return top100Players[index];
  }
};

export const getAllPlayers = (mode = 'mundial') => {
  return mode === 'brasileirao' ? brazillianPlayers : players;
};

export const evaluateGuess = (guess, target, mode = 'mundial') => {
  return {
    player: guess,
    nacionalidade: guess.Nation === target.Nation ? 'correct' : 'incorrect',
    liga: mode === 'brasileirao'
      ? (guess.State === target.State ? 'correct' : 'incorrect')
      : (guess.League === target.League ? 'correct' : 'incorrect'),
    time: guess.Team === target.Team ? 'correct' : 'incorrect',
    posicao: guess.Position === target.Position ? 'correct' : 'incorrect',
    idade: {
      status: guess.Age === target.Age ? 'correct' : 'incorrect',
      direction: guess.Age === target.Age ? 'equal' : guess.Age < target.Age ? 'up' : 'down'
    }
  };
};

const getGameStateKey = (mode) => `varDoDiaGameState${mode === 'brasileirao' ? '_br' : ''}`;
const getStatsKey = (mode) => `varDoDiaStats${mode === 'brasileirao' ? '_br' : ''}`;

export const getGameState = (mode = 'mundial') => {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-v4-SaltDoVarDoDia!`;
  
  const savedState = localStorage.getItem(getGameStateKey(mode));
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    if (parsedState.date === dateString) {
      return parsedState;
    }
  }
  
  return {
    date: dateString,
    guesses: [],
    gameStatus: 'IN_PROGRESS' // 'IN_PROGRESS', 'WON', 'LOST'
  };
};

export const saveGameState = (state, mode = 'mundial') => {
  localStorage.setItem(getGameStateKey(mode), JSON.stringify(state));
};

export const getStats = (mode = 'mundial') => {
  const savedStats = localStorage.getItem(getStatsKey(mode));
  if (savedStats) {
    return JSON.parse(savedStats);
  }
  return {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0
  };
};

export const saveStats = (stats, mode = 'mundial') => {
  localStorage.setItem(getStatsKey(mode), JSON.stringify(stats));
};

export const updateStatsOnEnd = (won, mode = 'mundial') => {
  const stats = getStats(mode);
  stats.played += 1;
  if (won) {
    stats.won += 1;
    stats.currentStreak += 1;
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }
  } else {
    stats.currentStreak = 0;
  }
  saveStats(stats, mode);
};
