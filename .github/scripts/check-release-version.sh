#!/usr/bin/env bash
set -euo pipefail

TAG="${TAG:-}"
VERSION=$(node -p "require('./package.json').version")

if [ "$TAG" != "$VERSION" ] && [ "$TAG" != "v$VERSION" ]; then
  echo "package.json is $VERSION, but the release is tagged ${TAG:-nothing}"
  exit 1
fi

echo "Publishing $VERSION as $TAG"
