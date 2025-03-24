# Contributing to Network Slicing Management Platform

Thank you for your interest in contributing to our project! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports:

1. Check the issue tracker to see if the problem has already been reported
2. If you're unable to find an open issue addressing the problem, open a new one

When creating a bug report, include as many details as possible:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots if applicable
- Environment details (OS, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues:

1. Provide a clear and descriptive title
2. Describe the current behavior and explain what you would like to see instead
3. Explain why this enhancement would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Installation

1. Clone your fork of the repository
2. Install dependencies:
   ```bash
   cd src/frontend
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Coding Guidelines

### JavaScript/React

- Follow the ESLint rules defined in the project
- Use functional components and hooks instead of class components
- Write meaningful variable and function names
- Add JSDoc comments for functions and components

### CSS/Styling

- Use Material-UI's styling system for consistency
- Follow BEM naming conventions for custom CSS classes
- Keep styles modular and component-specific

### Testing

- Write tests for new features and bug fixes
- Maintain test coverage above 80%
- Run the test suite before submitting a pull request:
  ```bash
  npm test
  ```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for tests
- `chore:` for changes to the build process or tooling

Example: `feat: add German localization for dashboard`

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [MIT License](LICENSE). 