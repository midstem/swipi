#!/usr/bin/env bash
set -euo pipefail

TAG="${TAG:-}"

if [[ ! "$TAG" =~ ^(.+)@([0-9]+\.[0-9]+\.[0-9]+.*)$ ]]; then
  echo "a release tag names one package: @midstem/swipi-react@1.0.1, @midstem/swipi-vue@1.0.0"
  echo "it is tagged ${TAG:-nothing}"
  exit 1
fi

PACKAGE="${BASH_REMATCH[1]}"
TAGGED="${BASH_REMATCH[2]}"

if ! MANIFESTS=$(npm pkg get version private --workspace "$PACKAGE" 2>/dev/null); then
  echo "$PACKAGE is not a workspace of this repository"
  exit 1
fi

VERSION=$(printf '%s' "$MANIFESTS" | node -e '
  const manifests = JSON.parse(require("node:fs").readFileSync(0, "utf8"))
  const manifest = manifests[process.argv[1]]

  if (manifest?.private) {
    console.error(`${process.argv[1]} is private, so it is never published`)
    process.exit(1)
  }

  if (typeof manifest?.version !== "string") process.exit(1)

  console.log(manifest.version)
' "$PACKAGE")

if [ "$TAGGED" != "$VERSION" ]; then
  echo "$PACKAGE is $VERSION, so the release must be tagged $PACKAGE@$VERSION"
  echo "it is tagged $TAG"
  exit 1
fi

if [[ "$VERSION" == *-* ]]; then
  NPM_TAG=next
else
  NPM_TAG=latest
fi

{
  echo "PACKAGE=$PACKAGE"
  echo "NPM_TAG=$NPM_TAG"
} >> "${GITHUB_ENV:-/dev/null}"

echo "Publishing $PACKAGE@$VERSION as $TAG on the $NPM_TAG dist-tag"
