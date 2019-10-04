FROM node:10 AS builder

MAINTAINER Shin Oka <rpiaips@gmail.com>
LABEL description="Build aips docker image"
LABEL app=aips
LABEL role=builder

WORKDIR /build/aips

RUN yarn install --production
RUN yarn build


MAINTAINER Shin Oka <rpiaips@gmail.com>
LABEL description="Run aips app"
LABEL app=aips
LABEL role=release

WORKDIR /aips

EXPOSE 3000
CMD yarn start