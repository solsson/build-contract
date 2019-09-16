FROM docker:19.03.2-dind@sha256:615eb3922630a30a52f7c46760f3d08a9eb4a1b0474d038281af8eade8c43f40

RUN apk add --no-cache curl nodejs npm bash docker-compose

VOLUME /source
WORKDIR /source

COPY package.json /usr/src/app/
RUN cd /usr/src/app/ && npm install --production
COPY build-contract parsetargets /usr/src/app/
COPY nodejs /usr/src/app/nodejs
RUN cd /usr/src/app/ && npm link --only=production

ENTRYPOINT ["build-contract"]
CMD ["push"]
