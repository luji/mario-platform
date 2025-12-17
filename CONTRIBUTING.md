# Contributing to Mario Platform

Thank you for your interest in contributing to Mario Platform! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mario-platform.git
   cd mario-platform
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/luji/mario-platform.git
   ```
4. **Checkout the develop branch**:
   ```bash
   git checkout develop
   ```

## Development Workflow

We use **Gitflow** for branch management. Please read [GITFLOW.md](./GITFLOW.md) for detailed information.

### Step 1: Create a Feature Branch

Always branch from `develop`:

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

### Step 2: Make Your Changes

- Write clean, maintainable code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### Step 3: Commit Your Changes

Use clear, descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat: add new power-up system"
```

**Commit message format**:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Step 4: Keep Your Branch Updated

Regularly sync with the upstream develop branch:

```bash
git fetch upstream
git merge upstream/develop
```

### Step 5: Push Your Changes

```bash
git push origin feature/your-feature-name
```

### Step 6: Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Set base repository to `luji/mario-platform` and base branch to `develop`
4. Set head repository to your fork and compare branch to your feature branch
5. Fill in the PR template:
   - **Title**: Clear, concise description
   - **Description**: What changes you made and why
   - **Related Issues**: Link any related issues
   - **Screenshots**: Include for UI changes
6. Request review from maintainers

## Pull Request Guidelines

### Before Submitting

- ✅ Code builds successfully (`npm run build`)
- ✅ All tests pass (`npm test`)
- ✅ Code follows project style (run Prettier if configured)
- ✅ Documentation is updated
- ✅ Commit messages are clear and follow conventions
- ✅ Branch is up-to-date with `develop`

### PR Requirements

- Target the `develop` branch (not `main`)
- Include a clear description of changes
- Reference related issues using `#issue-number`
- Pass all CI/CD checks
- Receive approval from at least one maintainer

### PR Review Process

1. **Automated checks** run (build, tests, linting)
2. **Code review** by maintainers
3. **Feedback** may be provided for improvements
4. **Approval** once everything looks good
5. **Merge** into develop by maintainers
6. **Deployment** to staging environment (automatic)

## Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow Angular style guide
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Formatting

This project uses Prettier for code formatting with configuration in `package.json`:
- Print width: 100 characters
- Single quotes for strings
- Angular parser for HTML templates

Prettier is configured but no format script is currently available. You can format files manually using your editor's Prettier integration.

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test -- --watch
```

### Writing Tests

- Write unit tests for new features
- Follow existing test patterns
- Aim for good test coverage
- Test edge cases and error conditions

## Project Structure

```
mario-platform/
├── src/
│   ├── app/              # Angular application code
│   ├── assets/           # Static assets (images, sounds)
│   └── index.html        # Main HTML file
├── public/               # Public assets
├── .github/
│   └── workflows/        # GitHub Actions CI/CD
├── BRANCHING.md          # Branching strategy details
├── GITFLOW.md            # Gitflow setup guide
├── CONTRIBUTING.md       # This file
└── README.md             # Project overview
```

## Reporting Bugs

When reporting bugs, please include:

1. **Clear title** describing the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Environment details**:
   - Browser and version
   - Operating system
   - Node.js version

Use the bug report template when creating an issue.

## Suggesting Features

We welcome feature suggestions! Please:

1. **Check existing issues** to avoid duplicates
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Provide examples** if possible

Use the feature request template when creating an issue.

## Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow

## Questions?

- 📖 Read the [documentation](./README.md)
- 💬 Open a discussion on GitHub
- 🐛 Report bugs via issues
- 📧 Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Mario Platform! 🎮 🍄
