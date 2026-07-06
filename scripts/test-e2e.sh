#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

if [ -f .nvmrc ]; then
  version="$(tr -d 'v' < .nvmrc)"
  for nvm_root in "$HOME/.nvm" "$HOME/Desktop/.nvm"; do
    node_dir="$nvm_root/versions/node/v$version/bin"
    if [ -d "$node_dir" ]; then
      export PATH="$node_dir:$PATH"
      break
    fi
  done
fi

exec node ./node_modules/@playwright/test/cli.js test "$@"