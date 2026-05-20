import players from '../data/players.json';

// Utility to generate a pseudo-random number from a string
const seededRandom = (seed) => {
  let h = 0xdeadbeef, i = 0;
  for (i = 0; i < seed.length; i++)
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  return ((h ^ h >>> 16) >>> 0) / 4294967296;
};

export const getDailyPlayer = () => {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-v4-SaltDoVarDoDia!`;
  
  const randomValue = seededRandom(dateString);
  const top100Players = players.filter(p => p.Rank <= 100);
  const index = Math.floor(randomValue * top100Players.length);
  
  return top100Players[index];
};

export const getAllPlayers = () => {
  return players;
};

export const evaluateGuess = (guess, target) => {
  return {
    player: guess,
    nacionalidade: guess.Nation === target.Nation ? 'correct' : 'incorrect',
    liga: guess.League === target.League ? 'correct' : 'incorrect',
    time: guess.Team === target.Team ? 'correct' : 'incorrect',
    posicao: guess.Position === target.Position ? 'correct' : 'incorrect',
    idade: {
      status: guess.Age === target.Age ? 'correct' : 'incorrect',
      direction: guess.Age === target.Age ? 'equal' : guess.Age < target.Age ? 'up' : 'down'
    }
  };
};

export const getGameState = () => {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-v4-SaltDoVarDoDia!`;
  
  const savedState = localStorage.getItem('varDoDiaGameState');
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

export const saveGameState = (state) => {
  localStorage.setItem('varDoDiaGameState', JSON.stringify(state));
};

export const getStats = () => {
  const savedStats = localStorage.getItem('varDoDiaStats');
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

export const saveStats = (stats) => {
  localStorage.setItem('varDoDiaStats', JSON.stringify(stats));
};

export const updateStatsOnEnd = (won) => {
  const stats = getStats();
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
  saveStats(stats);
};
