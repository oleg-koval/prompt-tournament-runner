# Refactor API client

## Objective

Make one small refactor repeatable, reversible, and easy to validate.

## Preconditions

- Repo is in a clean enough state to run the refactor steps.
- Baseline tests pass before changing code.

## Variables

- repo_root: /Users/olegkoval/projects/personal/active/mvps/ai-refactor-playbook-runner
- target_area: the module or flow you want to refactor

## Steps

1. Baseline tests
   - command: npm test
   - cwd: {{repo_root}}
   - retries: 1
   - timeout_seconds: 180
2. Typecheck
   - command: npm run typecheck
   - cwd: {{repo_root}}
   - retries: 0
   - timeout_seconds: 180
3. Build
   - command: npm run build
   - cwd: {{repo_root}}
   - retries: 0
   - timeout_seconds: 180

## Validation

- npm test
- npm run typecheck
- npm run build

## Rollback

- Revert the refactor branch.
- Restore the previous implementation from git.

## Success Criteria

- Tests stay green.
- Build emits clean output.
- No behavior change outside the refactor target.

## Kill Criteria

- Typecheck fails.
- Tests fail after the refactor.
- Build breaks or command output becomes noisy.
