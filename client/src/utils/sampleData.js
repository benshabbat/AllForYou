import { v4 as uuidv4 } from 'uuid';

const allergens = [
  { _id: 'a1', name: 'Gluten', hebrewName: 'גלוטן', icon: '🌾' },
  { _id: 'a2', name: 'Dairy', hebrewName: 'חלב', icon: '🥛' },
  { _id: 'a3', name: 'Nuts', hebrewName: 'אגוזים', icon: '🥜' },
  { _id: 'a4', name: 'Eggs', hebrewName: 'ביצים', icon: '🥚' },
  { _id: 'a5', name: 'Soy', hebrewName: 'סויה', icon: '🫘' },
];

const difficulties = ['קל', 'בינוני', 'מאתגר'];
const categories = ['עיקריות', 'קינוחים', 'סלטים', 'מרקים'];

function generateSampleRecipes(count = 20) {
  return Array.from({ length: count }, (_, index) => ({
    _id: uuidv4(),
    name: `מתכון ${index + 1}`,
    description: `תיאור קצר למתכון ${index + 1}. זהו מתכון טעים ומהיר להכנה.`,
    ingredients: [
      '2 כוסות קמח',
      '1 כוס סוכר',
      '3 ביצים',
      '1/2 כוס שמן',
      '1 כפית אבקת אפייה'
    ],
    instructions: `
      1. ערבבו את כל החומרים היבשים בקערה.
      2. הוסיפו את החומרים הרטובים וערבבו היטב.
      3. אפו בתנור שחומם מראש ל-180 מעלות למשך 30 דקות.
    `,
    preparationTime: Math.floor(Math.random() * 30) + 10,
    cookingTime: Math.floor(Math.random() * 60) + 20,
    servings: Math.floor(Math.random() * 6) + 2,
    difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    allergens: allergens
      .filter(() => Math.random() > 0.5)
      .map(allergen => ({ ...allergen })),
    createdBy: `user${Math.floor(Math.random() * 5) + 1}`,
    averageRating: (Math.random() * 4 + 1).toFixed(1),
    image: `https://picsum.photos/seed/${index}/300/200`,
    totalTime: function() {
      return this.preparationTime + this.cookingTime;
    },
  }));
}

export default generateSampleRecipes;