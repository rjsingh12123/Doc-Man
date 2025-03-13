FROM node:20 as builder

ENV NODE_ENV build

WORKDIR /home/node

COPY . /home/node

RUN yarn install \
    && yarn build

# ---

FROM node:20

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/tsconfig*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/src/ /home/node/src/
COPY --from=builder /home/node/dist/ /home/node/dist/
COPY --from=builder /home/node/.env* /home/node/

CMD ["yarn", "start:prod"]