#!/usr/bin/env bash
set -euo pipefail

TAG="${TAG:-}"
VERSION=$(node -p "require('./package.json').version")

if [ "$TAG" != "v$VERSION" ]; then
  echo "package.json is $VERSION, so the release must be tagged v$VERSION"
  echo "it is tagged ${TAG:-nothing}"
  exit 1
fi

echo "Publishing $VERSION as $TAG"
