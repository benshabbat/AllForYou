import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const getRecipes = async () => {
  const recipesCol = collection(db, 'recipes');
  const recipeSnapshot = await getDocs(recipesCol);
  return recipeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getRecipeById = async (id) => {
  const docRef = doc(db, 'recipes', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Recipe not found");
  }
};

export const addRecipe = async (recipe) => {
  const docRef = await addDoc(collection(db, 'recipes'), recipe);
  return { id: docRef.id, ...recipe };
};