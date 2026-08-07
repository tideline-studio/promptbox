# Promptbox

Save reusable texts in lists: prompts, commands, and more. Find them fast, copy in one click.

[Try it now](https://promptbox-ten.vercel.app/)

Create a list, add your text, then click to copy.

## Tech stack

| Layer         | Tools                                                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework     | [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)                                           |
| Storage       | [Dexie](https://dexie.org/) on [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)                                                              |
| Data fetching | [SWR](https://swr.vercel.app/)                                                                                                                                          |
| UI            | [Chakra UI](https://chakra-ui.com/), [PrimeReact](https://primereact.org/) / [PrimeIcons](https://primefaces.org/primeicons/), [Tailwind CSS](https://tailwindcss.com/) |
| Testing       | [Jest](https://jestjs.io/), [Playwright](https://playwright.dev/) (visual/e2e, optional)                                                                                |
| Tooling       | [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [pre-commit](https://pre-commit.com/)                                                                  |

## Development

### Prerequisites

- **Node.js** 18.17+ ([`.nvmrc`](.nvmrc) pins 18.17.0; run `nvm use` if you use nvm)
- **Yarn**
- **Python 3.10+** (for pre-commit hooks locally and in CI)

### Setup

```bash
yarn setup
```

This installs JS dependencies, pre-commit, and git hooks so formatting and lint run on every commit.

### Scripts

| Command                   | Description                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| `yarn dev`                | Start dev server at [http://localhost:3000](http://localhost:3000) |
| `yarn build`              | Production build                                                   |
| `yarn start`              | Serve production build                                             |
| `yarn lint`               | Run ESLint (with `--fix`)                                          |
| `yarn format`             | Auto-fix formatting with Prettier                                  |
| `yarn format:check`       | Verify formatting (same check CI runs)                             |
| `yarn test`               | Run Jest unit tests                                                |
| `yarn test:visual`        | Run Playwright tests (requires dev server)                         |
| `yarn test:visual:update` | Update Playwright snapshots                                        |

### Pre-commit hooks

`yarn setup` handles this. To reinstall hooks only:

```bash
pip install -r config/requirements.txt
pre-commit install
```

On each `git commit`, Prettier and ESLint run automatically. If Prettier reformats files, stage the changes and commit again.

You can also run checks manually:

```bash
yarn format
yarn format:check
yarn lint
pre-commit run --all-files
```

### Project structure

```
src/
├── api/           # Dexie database + prompt/list CRUD
├── app/           # Next.js App Router pages and layout
├── components/    # UI (editor, navigation, shared primitives)
├── contexts/      # React context (active list)
├── hooks/         # SWR data hooks + utilities
├── types/         # TypeScript interfaces
└── __tests__/     # Jest unit tests
```

## CI/CD

Two GitHub Actions workflows run on pushes and pull requests to `main`:

1. **`ci-validation`**: pre-commit checks, Jest unit tests, production build
2. **`ci-deployment`**: deploys to Vercel after `ci-validation` succeeds on `main`

Pull requests require passing CI and approval before merge.

### Vercel deployment

The `ci-deployment` workflow uses these GitHub secrets:

- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VERCEL_TOKEN`

Create a Vercel project named `promptbox` and add these secrets to the GitHub repository before the first deploy.

## Contributing

1. Fork and branch from `main`
2. Run `yarn setup`
3. Open a pull request using the [PR template](pull_request_template.md)
4. Ensure CI passes

## License

MIT © Slime Studio, 2026
