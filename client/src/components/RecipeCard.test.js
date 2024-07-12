import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeCard from './RecipeCard';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock recipe data
const mockRecipe = {
  _id: '1',
  name: 'Test Recipe',
  description: 'This is a test recipe',
  averageRating: 4.5,
  allergens: [{ _id: 'a1', name: 'Peanuts', icon: '🥜' }],
};

// Wrap component with Router for Link component
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: Router });
};

describe('RecipeCard', () => {
  test('renders recipe name', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
  });

  test('renders recipe description', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText('This is a test recipe')).toBeInTheDocument();
  });

  test('renders average rating', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('renders allergen icon', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByTitle('Peanuts')).toBeInTheDocument();
  });

  test('renders link to recipe details', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    const link = screen.getByRole('link', { name: 'צפה במתכון' });
    expect(link).toHaveAttribute('href', '/recipe/1');
  });
});