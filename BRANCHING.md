# Branch Strategy

## Main Branch

This repository uses `main` as the primary branch for production-ready code.

The `main` branch should be created from the current working branch once this PR is merged.

## Branch Structure

- `main` - Primary production branch (to be created from this PR)
- Feature branches - Created from `main` for new features
- All changes should be merged into `main` via pull requests

## CI/CD

The GitHub Actions workflow is configured to deploy from the `main` branch to Firebase Hosting.
See `.github/workflows/firebase-hosting.yml` for details.
