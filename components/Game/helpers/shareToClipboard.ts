import GuessResult from 'data/types/GuessResult';

const correctRatio = (guess: GuessResult): number => {
  const correct = guess.ingredients.filter((ing) => ing.correct).length;
  return correct / (correct + guess.missing);
};

const guessAsText = (guess: GuessResult) => {
  if (guess.result === 'jackpot') return '🟩';

  const r = correctRatio(guess);
  return r >= 0.5 ? '🟨' : r > 0 ? '🟧' : '🟥';
};

const shareToClipboard = (guesses: GuessResult[]): void => {
  const wotd = guesses.find((g) => g.result === 'jackpot');
  if (!wotd) throw new Error('Cannot share before winning!');

  navigator.clipboard.writeText(
    `achei o rango de hoje em ${guesses.length} tentativas

${guesses.map(guessAsText).join('')}

sua vez: ${location.href}`
  );
};

export default shareToClipboard;
