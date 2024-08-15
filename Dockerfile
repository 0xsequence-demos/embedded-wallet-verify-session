#
# Build step
#

FROM node:22 AS builder

RUN apt-get install -y git

ARG GITBRANCH=""
ARG GITCOMMIT=""
ARG SENTRY_AUTH_TOKEN=""

WORKDIR /embedded-wallet-verify-session

ADD . ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN cd client && pnpm i && pnpm run build && cd ../server && pnpm i

#
# Final image
#
FROM node:22 AS host

COPY --from=builder /embedded-wallet-verify-session/ /

RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]