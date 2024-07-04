import firebase from './firebaseConfig';

export const getRecipes = async () => {
  const snapshot = await firebase.firestore().collection('recipes').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getRecipeById = async (id) => {
  const doc = await firebase.firestore().collection('recipes').doc(id).get();
  return { id: doc.id, ...doc.data() };
};

export const addRecipe = async (recipe) => {
  const docRef = await firebase.firestore().collection('recipes').add(recipe);
  return { id: docRef.id, ...recipe };
};