# Gitflow Setup Guide

This repository is configured to use **Gitflow** as its branching model. This document explains how to set up and use Gitflow for development.

## What is Gitflow?

Gitflow is a branching model for Git that provides a robust framework for managing larger projects. It defines a strict branching structure designed around project releases.

## Branch Overview

- **`main`**: Production-ready code (protected)
- **`develop`**: Integration branch for features (protected)
- **`feature/*`**: New feature development
- **`release/*`**: Release preparation
- **`hotfix/*`**: Emergency production fixes

For detailed information about the branching strategy, see [BRANCHING.md](./BRANCHING.md).

## Installation

### Option 1: Using git-flow Extension (Recommended)

The git-flow extension provides convenient commands for Gitflow operations.

**macOS**:
```bash
brew install git-flow-avh
```

**Linux (Debian/Ubuntu)**:
```bash
sudo apt-get install git-flow
```

**Linux (Fedora)**:
```bash
sudo dnf install gitflow
```

**Windows**:
Download from: https://github.com/petervanderdoes/gitflow-avh/wiki/Installing-on-Windows

### Option 2: Manual Gitflow (No Installation Required)

You can follow Gitflow principles using standard Git commands. See the workflows in [BRANCHING.md](./BRANCHING.md).

## Initial Setup

### With git-flow Extension

1. **Clone and initialize**:
```bash
git clone https://github.com/luji/mario-platform.git
cd mario-platform
git flow init
```

2. **When prompted, use these settings**:
   - Branch name for production releases: `main`
   - Branch name for "next release" development: `develop`
   - Feature branches prefix: `feature/`
   - Release branches prefix: `release/`
   - Hotfix branches prefix: `hotfix/`
   - Version tag prefix: `v`

   These settings are pre-configured in the `.gitflow` file.

### Without git-flow Extension

1. **Clone the repository**:
```bash
git clone https://github.com/luji/mario-platform.git
cd mario-platform
```

2. **Checkout the develop branch**:
```bash
git checkout develop
```

## Daily Workflows

### Starting a New Feature

**With git-flow**:
```bash
git flow feature start my-new-feature
# Work on your feature...
git add .
git commit -m "Implement new feature"
git flow feature publish my-new-feature
# Create a Pull Request to develop on GitHub
```

**Without git-flow**:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature
# Work on your feature...
git add .
git commit -m "Implement new feature"
git push origin feature/my-new-feature
# Create a Pull Request to develop on GitHub
```

### Finishing a Feature

Features should be merged via **Pull Requests** on GitHub for code review:

1. Push your feature branch to GitHub
2. Open a Pull Request from `feature/my-new-feature` to `develop`
3. Request code review
4. After approval and passing CI, merge the PR
5. Delete the feature branch

### Starting a Release

**With git-flow**:
```bash
git flow release start v1.0.0
# Update version in package.json
npm version 1.0.0 --no-git-tag-version
git add package.json package-lock.json
git commit -m "Bump version to 1.0.0"
git flow release publish v1.0.0
# Create Pull Requests: 
# 1. release/v1.0.0 → main
# 2. After merging to main, merge main → develop
```

**Without git-flow**:
```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
# Update version in package.json
npm version 1.0.0 --no-git-tag-version
git add package.json package-lock.json
git commit -m "Bump version to 1.0.0"
git push origin release/v1.0.0
# Create Pull Request to main
```

### Creating a Hotfix

**With git-flow**:
```bash
git flow hotfix start fix-critical-bug
# Fix the bug...
git add .
git commit -m "Fix critical bug"
git flow hotfix publish fix-critical-bug
# Create Pull Requests:
# 1. hotfix/fix-critical-bug → main
# 2. After merging to main, merge main → develop
```

**Without git-flow**:
```bash
git checkout main
git pull origin main
git checkout -b hotfix/fix-critical-bug
# Fix the bug...
git add .
git commit -m "Fix critical bug"
git push origin hotfix/fix-critical-bug
# Create Pull Request to main
```

## Version Numbering

This project follows [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH (e.g., 1.2.3)
```

- **MAJOR**: Breaking changes (1.0.0 → 2.0.0)
- **MINOR**: New features, backward compatible (1.0.0 → 1.1.0)
- **PATCH**: Bug fixes, backward compatible (1.0.0 → 1.0.1)

### Updating Version

```bash
# Patch release (1.0.0 → 1.0.1)
npm version patch --no-git-tag-version

# Minor release (1.0.0 → 1.1.0)
npm version minor --no-git-tag-version

# Major release (1.0.0 → 2.0.0)
npm version major --no-git-tag-version
```

## CI/CD Integration

The repository includes GitHub Actions workflows that support Gitflow:

### Automatic Deployments

- **`main` branch** → Firebase Hosting Production (live)
- **`develop` branch** → Firebase Hosting Staging
- **Pull Requests** → Firebase Hosting Preview (7-day expiry)

### Build and Test

All branches and pull requests trigger:
1. Dependency installation
2. Production build
3. Artifact upload

## Best Practices

1. **Always work in feature branches**, never commit directly to `develop` or `main`
2. **Keep feature branches small** and focused on a single feature
3. **Regularly sync** with develop to avoid merge conflicts:
   ```bash
   git checkout feature/my-feature
   git fetch origin
   git merge origin/develop
   ```
4. **Write clear commit messages** following [Conventional Commits](https://www.conventionalcommits.org/)
5. **Create Pull Requests early** to get feedback
6. **Request code reviews** before merging
7. **Delete branches** after they're merged
8. **Tag releases** in the main branch with version numbers

## Example Commit Messages

```bash
feat: add enemy AI behavior
fix: correct collision detection bug
docs: update installation instructions
style: format code with prettier
refactor: simplify player movement logic
test: add unit tests for power-ups
chore: update dependencies
```

## Troubleshooting

### Syncing Your Feature Branch

If your feature branch is behind develop:
```bash
git checkout feature/my-feature
git fetch origin
git merge origin/develop
# Resolve any conflicts
git push origin feature/my-feature
```

### Abandoning a Feature

If you need to cancel a feature:
```bash
git checkout develop
git branch -D feature/abandoned-feature
git push origin --delete feature/abandoned-feature
```

### Resolving Merge Conflicts

1. Update your local branch
2. Merge from the target branch (develop or main)
3. Resolve conflicts in your editor
4. Test your changes
5. Commit and push

```bash
git checkout feature/my-feature
git fetch origin
git merge origin/develop
# Fix conflicts in files
git add .
git commit -m "Resolve merge conflicts with develop"
git push origin feature/my-feature
```

## Additional Resources

- [Atlassian Gitflow Tutorial](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Original Gitflow Blog Post](https://nvie.com/posts/a-successful-git-branching-model/)
- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Getting Help

If you have questions about Gitflow or run into issues:

1. Check this documentation
2. Review [BRANCHING.md](./BRANCHING.md) for workflow details
3. Ask your team lead or senior developers
4. Open an issue in the repository

---

**Remember**: The goal of Gitflow is to make collaboration easier and releases more predictable. When in doubt, ask for help!
