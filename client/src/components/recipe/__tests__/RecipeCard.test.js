import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RecipeCard from '../RecipeCard';

const mockRecipe = {
  _id: '1',
  name: 'מתכון לעוגת שוקולד',
  description: 'עוגת שוקולד טעימה ופשוטה להכנה',
  image: 'http://example.com/image.jpg',
};

test('renders recipe card correctly', () => {
  render(
    <MemoryRouter>
      <RecipeCard recipe={mockRecipe} />
    </MemoryRouter>
  );

  expect(screen.getByText(mockRecipe.name)).toBeInTheDocument();
  expect(screen.getByText(mockRecipe.description)).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', mockRecipe.image);
  expect(screen.getByRole('link')).toHaveAttribute('href', `/recipe/${mockRecipe._id}`);
});