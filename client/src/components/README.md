# Components Documentation

This directory contains all React components used in the AllForYou application.

## Directory Structure

```
components/
├── common/                 # Reusable common components
│   ├── ErrorBoundary.tsx  # Error boundary for catching errors
│   ├── Button/            # Button component
│   ├── Input/             # Input component
│   └── ...
├── layout/                # Layout components
│   ├── Header/            # Application header
│   ├── Footer/            # Application footer
│   ├── Sidebar/           # Sidebar navigation
│   └── ...
├── recipe/                # Recipe-related components
│   ├── RecipeCard/        # Recipe card display
│   ├── RecipeList/        # List of recipes
│   ├── RecipeForm/        # Recipe creation/edit form
│   └── ...
├── user/                  # User-related components
│   ├── UserProfile/       # User profile display
│   ├── UserAvatar/        # User avatar component
│   └── ...
├── forum/                 # Forum components
├── product/               # Product-related components
├── allergen/              # Allergen-related components
├── filterSideBar/         # Filtering sidebar
├── search/                # Search components
├── commentSection/        # Comment section
├── ratingStars/           # Star rating component
└── imageUpload/           # Image upload component
```

## Component Guidelines

### File Structure
Each component should follow this structure:
```
ComponentName/
├── ComponentName.jsx          # Component logic
├── ComponentName.module.css   # Component styles
├── ComponentName.test.js      # Component tests
└── index.js                   # Export file
```

### Component Template
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './ComponentName.module.css';

/**
 * ComponentName - Brief description
 * @param {Object} props - Component props
 */
const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

### Best Practices

1. **Single Responsibility**: Each component should do one thing well
2. **Reusability**: Design components to be reusable across the app
3. **Prop Types**: Always define prop types for documentation and validation
4. **Accessibility**: Include ARIA labels and semantic HTML
5. **Performance**: Use React.memo() for expensive components
6. **Testing**: Write tests for all components
7. **CSS Modules**: Use CSS Modules for styling to avoid conflicts
8. **Error Handling**: Wrap components with ErrorBoundary when needed

### Naming Conventions

- **Components**: PascalCase (e.g., `RecipeCard`, `UserProfile`)
- **Files**: Match component name (e.g., `RecipeCard.jsx`)
- **CSS Classes**: camelCase in modules (e.g., `.recipeCard`)
- **Props**: camelCase (e.g., `onClick`, `isActive`)
- **Event Handlers**: Prefix with `handle` (e.g., `handleClick`)

### Common Components

#### ErrorBoundary
Wraps components to catch and handle errors gracefully.

```jsx
import ErrorBoundary from './components/common/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

#### Button
Reusable button component with variants.

```jsx
import Button from './components/common/Button';

<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

### Hooks Usage

Use custom hooks from the `hooks/` directory:
- `useAuth` - Authentication state
- `useForm` - Form management
- `useLocalStorage` - Local storage management
- `useMediaQuery` - Responsive design
- `useToast` - Toast notifications

### State Management

- **Local State**: Use `useState` for component-specific state
- **Global State**: Use Redux for app-wide state
- **Server State**: Use React Query for API data

### Example: Creating a New Component

1. Create directory: `components/myFeature/MyComponent/`
2. Create component file: `MyComponent.jsx`
3. Create styles: `MyComponent.module.css`
4. Create tests: `MyComponent.test.js`
5. Create index: `index.js`
6. Export from parent index if needed

```jsx
// MyComponent.jsx
import React from 'react';
import styles from './MyComponent.module.css';

const MyComponent = () => {
  return <div className={styles.container}>My Component</div>;
};

export default MyComponent;
```

```css
/* MyComponent.module.css */
.container {
  padding: 1rem;
  background-color: var(--primary-color);
}
```

```javascript
// index.js
export { default } from './MyComponent';
```

## Testing Components

Use React Testing Library for component tests:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/testUtils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('My Component')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    renderWithProviders(<MyComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Styling Guidelines

- Use CSS Modules for component-specific styles
- Follow mobile-first approach
- Use CSS variables for theming
- Keep styles scoped to components
- Use semantic class names

## Accessibility

- Use semantic HTML elements
- Include ARIA labels for interactive elements
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast

## Resources

- [React Documentation](https://react.dev/)
- [React Testing Library](https://testing-library.com/react)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
