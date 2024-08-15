#!/usr/bin/env bash

set -euo pipefail

BUILD_SUCCESS=1
BUILDKITE_SHORT_COMMIT=${BUILDKITE_COMMIT:0:12}

function cleanup {
  if [ ${BUILD_SUCCESS} -eq 0 ]; then
      docker rmi -f "${IMAGE_REGISTRY_REPO_NAME}/${BUILDER_APP}":"${BUILDKITE_SHORT_COMMIT}"
#      TODO: Consider using a filter to limit how much cache we want to remove
      docker buildx prune -f #--filter=until=30m
  fi
}

trap cleanup EXIT

GITBRANCH="${BUILDKITE_BRANCH}"
GITCOMMIT="${BUILDKITE_COMMIT}"
GITCOMMITDATE=$(git log -1 --date=iso --pretty=format:%cd)
VERSION=$(git describe --exact-match --tags HEAD 2>/dev/null || echo "${GITCOMMIT}")

echo "Building image: ${IMAGE_REGISTRY_REPO_NAME}/${BUILDER_APP}:${BUILDKITE_SHORT_COMMIT}"
( set -x ; docker buildx build --force-rm --rm --push --pull \
  --build-arg GITBRANCH="${GITBRANCH}" \
  --build-arg GITCOMMIT="${GITCOMMIT}"\
  --build-arg GITCOMMITDATE="${GITCOMMITDATE}" \
  --build-arg VERSION="${VERSION}" \
  --label ci.horizon-games="${BUILDER_APP}-${BUILDKITE_SHORT_COMMIT}" \
  --file "Dockerfile" \
  --tag "${IMAGE_REGISTRY_REPO_NAME}/${BUILDER_APP}":"${BUILDKITE_SHORT_COMMIT}" ./ )

BUILD_SUCCESS=$?
