# Gitflow Branch Strategy

This repository uses **Gitflow** as its branching model. Gitflow is a branching strategy that helps manage feature development, releases, and hotfixes in a structured way.

## Branch Structure

### Main Branches

- **`main`** - Production branch
  - Contains production-ready code
  - Always deployable
  - Tagged with version numbers
  - Protected branch - requires pull request reviews
  - Automatically deploys to Firebase Hosting production

- **`develop`** - Development integration branch
  - Main branch for ongoing development
  - Contains latest delivered development changes
  - Base branch for all feature branches
  - Protected branch - requires pull request reviews

### Supporting Branches

#### Feature Branches (`feature/*`)
- **Purpose**: Develop new features
- **Branch from**: `develop`
- **Merge into**: `develop`
- **Naming**: `feature/description-of-feature`
- **Examples**: 
  - `feature/add-sound-effects`
  - `feature/new-level-design`
  - `feature/player-powerups`

**Workflow**:
```bash
# Create a feature branch
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature

# Work on your feature...
git add .
git commit -m "Add new feature"

# Push and create PR to develop
git push origin feature/my-new-feature
```

#### Release Branches (`release/*`)
- **Purpose**: Prepare for a new production release
- **Branch from**: `develop`
- **Merge into**: `main` AND `develop`
- **Naming**: `release/v{version}`
- **Examples**: 
  - `release/v1.0.0`
  - `release/v1.1.0`

**Workflow**:
```bash
# Create a release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# Finalize release (bump version, update changelog, etc.)
# Update package.json version
npm version minor --no-git-tag-version
git commit -am "Bump version to 1.0.0"

# Merge to main
git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff release/v1.0.0
git push origin develop

# Delete release branch
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

#### Hotfix Branches (`hotfix/*`)
- **Purpose**: Quick fixes for production issues
- **Branch from**: `main`
- **Merge into**: `main` AND `develop`
- **Naming**: `hotfix/description-of-fix`
- **Examples**: 
  - `hotfix/fix-collision-bug`
  - `hotfix/fix-sound-loading`

**Workflow**:
```bash
# Create a hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/fix-critical-bug

# Fix the bug...
git add .
git commit -m "Fix critical bug"

# Merge to main
git checkout main
git merge --no-ff hotfix/fix-critical-bug
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff hotfix/fix-critical-bug
git push origin develop

# Delete hotfix branch
git branch -d hotfix/fix-critical-bug
git push origin --delete hotfix/fix-critical-bug
```

## Quick Reference

| Branch Type | Branches From | Merges To | Naming Convention |
|-------------|---------------|-----------|-------------------|
| Feature | `develop` | `develop` | `feature/*` |
| Release | `develop` | `main` + `develop` | `release/v*` |
| Hotfix | `main` | `main` + `develop` | `hotfix/*` |

## Pull Request Guidelines

1. **Feature PRs**: Target `develop` branch
2. **Release PRs**: Target `main` branch, then merge back to `develop`
3. **Hotfix PRs**: Target `main` branch, then merge back to `develop`
4. All PRs require:
   - Passing CI/CD checks
   - Code review approval
   - Up-to-date with target branch

## Gitflow Diagram

```
main      ─────●─────────●─────────●────────→ (production)
              ↑ v1.0    ↑ v1.1    ↑ v1.1.1
             /         /         /
release    ─/─●──────/─●───────/───────────→
           /  │     /  │       /
develop   ●───●────●───●──────●────●────●───→ (integration)
          │    \    \           \    \
feature   │     ●────●           ●────●──────→
          │   (feat A)          (feat B)
          │
hotfix    └──────────────────────●───────────→
                              (fix v1.1.1)
```

## Getting Started with Gitflow

### First Time Setup

1. **Clone the repository**:
```bash
git clone https://github.com/luji/mario-platform.git
cd mario-platform
```

2. **Checkout develop branch** (for regular development):
```bash
git checkout develop
git pull origin develop
```

3. **Start working on a feature**:
```bash
git checkout -b feature/my-feature
```

### Daily Workflow

1. Always start from `develop` for new features
2. Keep your branch updated with `develop`
3. Create pull requests to merge back to `develop`
4. After PR approval, merge and delete your feature branch

## CI/CD Integration

The GitHub Actions workflow supports Gitflow branches:

- **`main`** branch pushes → Deploy to Firebase Hosting production
- **`develop`** branch pushes → Deploy to Firebase Hosting staging (if configured)
- **Pull requests** → Deploy preview channels
- **`release/*`** and **`hotfix/*`** → Build and test

See `.github/workflows/firebase-hosting.yml` for complete workflow details.

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version (1.0.0 → 2.0.0): Breaking changes
- **MINOR** version (1.0.0 → 1.1.0): New features, backwards compatible
- **PATCH** version (1.0.0 → 1.0.1): Bug fixes, backwards compatible

## Additional Resources

- [Original Gitflow Article by Vincent Driessen](https://nvie.com/posts/a-successful-git-branching-model/)
- [Atlassian Gitflow Tutorial](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
