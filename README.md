# ethnode-sidecar

A sidecar for ethereum beacon clients providing readiness and liveness probes.

## Prerequisites

- [Beacon Client](https://ethereum.org/en/upgrades/get-involved/#clients)

## Run

Copy .env.example to .env and adjust values.

install dependencies

```
npm install
```

start app

```
npm start
```

An OpenAPI documentation is available at `http://localhost:3000/api`.

## Run in Docker

pull image

```
docker pull luisnaldo7/ethnode-sidecar:latest
```

or build image

```
docker build -t luisnaldo7/ethnode-sidecar:latest .
```

execute container

```
docker run -d -p 3000:3000 --rm --name ethnode-sidecar luisnaldo7/ethnode-sidecar:latest
```

execute container on boot

```
docker run -d -p 3000:3000 --restart always --name ethnode-sidecar luisnaldo7/ethnode-sidecar:latest
```

## Run in Docker-Compose

execute container

```
docker-compose up
```

stop container

```
docker-compose down
```
