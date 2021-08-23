FROM node:16.6.2-alpine3.11 as build
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --network-timeout=6000000 --frozen-lockfile
COPY . .
RUN yarn build --production

FROM node:16.6.2-alpine3.11 as server
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules node_modules
COPY --from=build /usr/src/app/package*.json .
COPY --from=build /usr/src/app/src/server .
COPY --from=build /usr/src/app/src/jobs .
CMD ["node", "index.js"]

FROM node:16.6.2-alpine3.11 as frontend
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/build build/
COPY --from=build /usr/src/app/.env ./
RUN yarn global add @beam-australia/react-env
RUN yarn global add serve

EXPOSE 5000
CMD react-env -d build -- serve build
