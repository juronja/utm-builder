#!/bin/bash

# Stoping the containers
docker compose down
#docker image prune --force

# Downloading and overwriting the compose file
wget -O compose.yaml https://raw.githubusercontent.com/juronja/utm-builder/refs/heads/dev/compose.yaml > compose.yaml

# Starting the containers
docker compose up -d