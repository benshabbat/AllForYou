# Contributing to AllForYou

Thank you for considering contributing to AllForYou! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and encourage diverse perspectives
- Focus on constructive feedback
- Be patient and understanding

## How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check the existing issues to avoid duplicates
2. Collect information about the bug:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

Create an issue with:
- Clear and descriptive title
- Detailed description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Additional context

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:
- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- List any similar features in other applications

### Pull Requests

1. **Fork the repository** and create your branch from `main`
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Follow the code style (ESLint + Prettier)
   - Write meaningful commit messages
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   cd client && npm test
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git commit -m "Add: amazing feature description"
   ```
   
   Commit message prefixes:
   - `Add:` New feature
   - `Fix:` Bug fix
   - `Update:` Update existing feature
   - `Refactor:` Code refactoring
   - `Docs:` Documentation changes
   - `Test:` Adding or updating tests
   - `Style:` Code style changes

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe what changes you made
   - Reference any related issues
   - Include screenshots for UI changes

## Development Setup

1. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/AllForYou.git
   cd AllForYou
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   - Copy `.env.example` files in both client and server
   - Fill in your local configuration

4. **Start development servers**
   ```bash
   npm run dev
   ```

## Code Style Guidelines

### JavaScript/TypeScript
- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Use async/await over promises chains
- Use meaningful variable and function names

### React
- Use functional components with hooks
- Keep components small and focused
- Use prop-types or TypeScript for type checking
- Follow the single responsibility principle
- Extract reusable logic into custom hooks

### CSS
- Use CSS Modules for component styles
- Follow BEM naming convention
- Mobile-first approach
- Use CSS variables for theming

### File Structure
```
component/
├── ComponentName.jsx       # Component logic
├── ComponentName.module.css # Component styles
├── ComponentName.test.js   # Component tests
└── index.js               # Export
```

## Testing Guidelines

- Write tests for new features
- Maintain or improve code coverage
- Test edge cases and error scenarios
- Use descriptive test names

```javascript
describe('RecipeCard', () => {
  it('should render recipe title correctly', () => {
    // Test implementation
  });
  
  it('should handle missing image gracefully', () => {
    // Test implementation
  });
});
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for functions
- Update API documentation for endpoint changes
- Include code examples when helpful

## Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for your contributions! 🎉
