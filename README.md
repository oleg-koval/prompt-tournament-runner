<p align="center">
  <a href="./.github/workflows/ci.yml"><img src="https://github.com/oleg-koval/ai-refactor-playbook-runner/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/oleg-koval/ai-refactor-playbook-runner/releases"><img src="https://img.shields.io/github/v/release/oleg-koval/ai-refactor-playbook-runner" alt="GitHub release"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license"></a>
</p>

<p align="center">
  <img src="./logo.svg" width="120" height="120" alt="AI Refactor Playbook Runner logo">
</p>

<h1 align="center">ai-refactor-playbook-runner</h1>

<p align="center">
  Markdown-driven refactor playbooks for repeatable cleanup work<br>
  <strong>Dry-run, resume, retries, and a mobile-friendly local UI</strong>
</p>

---

## Features

- Parses reusable playbooks from markdown
- Supports inherited templates and clean merge behavior
- Expands `{{placeholder}}` values in step names, commands, and cwd
- Runs sequential steps with retries and per-step timeout reporting
- Supports `--dry-run` and `--resume`
- Ships a local browser UI and a Tailscale-friendly server bind

## Installation

```bash
npm ci
npm run build
```

## Quick start

Run the sample playbook:

```bash
node dist/cli.js run examples/demo.md
```

Preview it without executing commands:

```bash
node dist/cli.js run examples/demo.md --dry-run
```

Start the local UI:

```bash
node dist/cli.js serve --host 0.0.0.0 --port 8787
```

Open it from mobile on Tailscale with your machine's Tailscale IP or MagicDNS hostname.

## Commands

- `node dist/cli.js run <playbook.md>` - run a playbook
- `node dist/cli.js run <playbook.md> --dry-run` - render the plan without executing commands
- `node dist/cli.js run <playbook.md> --resume` - resume from the last successful step
- `node dist/cli.js serve --host 0.0.0.0 --port 8787` - open the browser UI

## Playbook format

A playbook is markdown with these sections:

- `# Title`
- `## Objective`
- `## Preconditions`
- `## Inherited Template`
- `## Variables`
- `## Steps`
- `## Validation`
- `## Rollback`
- `## Success Criteria`
- `## Kill Criteria`

Step fields:

- `name`
- `command`
- `cwd`
- `retries`
- `timeout_seconds`

Variables use `{{placeholder}}` syntax and merge from the playbook plus runtime overrides.

## Examples

- `examples/demo.md` - sample playbook

## Documentation

- [GitHub Pages site](https://oleg-koval.github.io/ai-refactor-playbook-runner/)
- [Release notes](https://github.com/oleg-koval/ai-refactor-playbook-runner/releases)
- [Issue tracker](https://github.com/oleg-koval/ai-refactor-playbook-runner/issues)

## System requirements

- Node.js 20.10 or newer
- A shell environment for the commands in your playbooks
- Local network access if you want to open the UI from mobile over Tailscale

## Security notes

- Playbooks run shell commands. Review markdown before execution.
- Use `--dry-run` first for new playbooks.
- Keep commands scoped to the working directory you intend.

## Support

Support is best-effort and issue-driven. Read [SUPPORT.md](./SUPPORT.md) for the policy.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

## License

MIT. See [LICENSE](./LICENSE).

## Author

Oleg Koval - [olegkoval.com](https://olegkoval.com)

---

<p align="center">
  <a href="https://oleg-koval.github.io/ai-refactor-playbook-runner/">Website</a> ·
  <a href="https://github.com/oleg-koval/ai-refactor-playbook-runner">GitHub</a> ·
  <a href="https://github.com/oleg-koval/ai-refactor-playbook-runner/releases">Releases</a> ·
  <a href="https://github.com/oleg-koval/ai-refactor-playbook-runner/issues">Issues</a>
</p>
