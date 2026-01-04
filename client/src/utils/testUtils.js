import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Custom render function that includes all providers
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @param {Object} options.store - Redux store (optional)
 * @param {Object} options.queryClient - React Query client (optional)
 * @returns {Object} Render result
 */
export function renderWithProviders(
  ui,
  {
    store = null,
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    let wrapped = children;

    if (queryClient) {
      wrapped = (
        <QueryClientProvider client={queryClient}>
          {wrapped}
        </QueryClientProvider>
      );
    }

    if (store) {
      wrapped = <Provider store={store}>{wrapped}</Provider>;
    }

    return <BrowserRouter>{wrapped}</BrowserRouter>;
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

/**
 * Mock user for testing
 */
export const mockUser = {
  _id: '123',
  username: 'testuser',
  email: 'test@example.com',
  allergens: [],
  favorites: [],
};

/**
 * Mock recipe for testing
 */
export const mockRecipe = {
  _id: '456',
  title: 'Test Recipe',
  description: 'A test recipe',
  ingredients: ['ingredient 1', 'ingredient 2'],
  instructions: ['step 1', 'step 2'],
  allergens: [],
  category: 'dessert',
  difficulty: 'easy',
  prepTime: 30,
  cookTime: 45,
  servings: 4,
  author: mockUser,
  ratings: [],
  averageRating: 0,
  createdAt: new Date().toISOString(),
};

/**
 * Wait for loading to finish
 */
export const waitForLoadingToFinish = () =>
  screen.findByText(/loading/i, {}, { timeout: 3000 }).catch(() => null);

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
