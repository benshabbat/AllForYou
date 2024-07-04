const API_URL = 'http://localhost:5000/api';

export async function fetchRecipes(allergens = []) {
  const response = await fetch(`${API_URL}/recipes?allergens=${allergens.join(',')}`);
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
}

export async function addRecipe(recipe) {
  const response = await fetch(`${API_URL}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  });
  if (!response.ok) {
    throw new Error('Failed to add recipe');
  }
  return response.json();
}

export async function updateRecipe(id, recipe) {
  const response = await fetch(`${API_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  });
  if (!response.ok) {
    throw new Error('Failed to update recipe');
  }
  return response.json();
}

export async function deleteRecipe(id) {
  const response = await fetch(`${API_URL}/recipes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete recipe');
  }
  return response.json();
}

export async function searchRecipes(ingredients) {
  const response = await fetch(`${API_URL}/recipes/search?ingredients=${ingredients.join(',')}`);
  if (!response.ok) {
    throw new Error('Failed to search recipes');
  }
  return response.json();
}