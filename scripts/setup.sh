#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

echo "Installing JS dependencies..."
yarn install

echo "Installing Playwright browsers..."
yarn playwright:install

echo "Installing pre-commit..."
python3 -m pip install -r config/requirements.txt

echo "Installing git hooks..."
pre-commit install

echo ""
echo "Setup complete. Prettier and ESLint run on every git commit."
echo "Manual checks: yarn format | yarn format:check | yarn lint"
echo "E2E tests: yarn test:e2e | yarn test:e2e:ui | yarn test:e2e:debug"