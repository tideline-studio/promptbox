## Promptbox

From Git commands and AI prompts to anything you reuse  
**_Organized, searchable, and one click to copy_**

👉 [Try it Now](https://promptbox.vercel.app/)

## Development

#### Project Setup

Ensure the following are installed on your device before proceeding:

- Node.js (version 18.17 or higher)
- Yarn (as the package manager)

#### Running the Project

- Framework and Tools: This repo is developed using `Next.js` and `React`, with `IndexedDB` for local persistent data storage, and `Jest` for testing.

- Install Dependencies: Start by installing all required dependencies. Run `yarn install`.

- Start Development Server: To launch the local development server, run `yarn dev`. The application will be accessible at localhost:3000 in your web browser.

- Run Tests: For executing the test suite, use `yarn test`.

#### Formatting and linting

Before contributing to this repo, setting up `pre-commit` is required. Follow the installation instructions available at [pre-commit.com](https://pre-commit.com/). In the root directory of this repo, run the following command to install the pre-commit hook:

```bash
$ pre-commit install
```

Upon successful installation, you should see an output similar to:

```bash
pre-commit installed at .git/hooks/pre-commit
```

Once pre-commit is configured, it will automatically run `Prettier` and `ESLint` checks during each commit. If errors are found, you'll need to address and correct them before your changes can be successfully committed.

#### Workflows

This repo employs GitHub Actions that automatically execute upon opening a new pull request and with every subsequent commit to that pull request. These actions include formatting, linting, building, and, post-merge, deploying your changes to [Vercel](https://promptbox.vercel.app). For a successful merge, all actions must pass, and your pull request requires approval. Once merged, the actions rerun on the main branch.

#### Vercel deployment

The `ci-deployment` workflow deploys to Vercel using these GitHub secrets:

- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VERCEL_TOKEN`

Create a new Vercel project named `promptbox` and add these secrets to your GitHub repository before the first deploy.

## Contact

© Tideline Studio, since 2026