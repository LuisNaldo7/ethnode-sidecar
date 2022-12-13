# Build stage
FROM node:19.2.0 as build

## Create app directory
WORKDIR /app

## Install app dependencies
COPY tsconfig*.json package*.json ./
RUN npm ci --omit=dev

## Bundle app source
COPY ./src ./src

## Build app
RUN npm run build



# Run stage
FROM node:19.2.0

## Switch to less privileged user
USER node

## Declare env vars
ENV CLIENT_SCHEME=http
ENV CLIENT_HOST=localhost
ENV CLIENT_PORT=5052
ENV CLIENT_MIN_PEERS=10

## Create app directory
WORKDIR /app

## Copy app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

## Execute app
CMD [ "node", "dist/main"]

## Expose port
EXPOSE 3000