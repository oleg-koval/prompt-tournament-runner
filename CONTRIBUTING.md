# Contributing

This repo is an MVP. Keep changes small and focused on the core refactor runner.

## Before you open a PR

- Run `npm run ci`
- Run `npm run build`
- Make sure pre-commit hooks pass locally
- Keep new files under the 300-line cap

## Pull request shape

- One problem per PR
- Include tests for behavior changes
- Prefer integration coverage through the public API
- Use conventional commits in the final squash commit message

## What this project is not

- Not a general workflow engine
- Not a deployment orchestrator
- Not a monorepo-wide automation platform
