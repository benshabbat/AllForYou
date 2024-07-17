export const translateDifficulty = (difficulty) => {
    const difficultyMap = {
      'Easy': 'קל',
      'Medium': 'בינוני',
      'Hard': 'מאתגר'
    };
    return difficultyMap[difficulty] || difficulty;
  };
  
  export const DIFFICULTY_CLASSES = {
    'Easy': 'easy',
    'Medium': 'medium',
    'Hard': 'hard'
  };