# Open Source UTM Builder

Self host this UTM builder for your technical marketing needs.

## Exposed ports:
UTM App: `3131`
Mongo Express: `3181` 

## Deploy

Here is a docker compose.yaml file. Add your credentials in .env as needed.

```yaml
name: utm-builder # Will be used for auto naming (network, volume names)
services:
  app:
    container_name: ub-app
    restart: unless-stopped
    image: juronja/utm-builder:latest
    pull_policy: always
    depends_on:
      db:
        condition: service_healthy
    ports:
      - 3131:3000
    environment: # Add .env variables for this container
      MONGO_ADMIN_USER: ${MONGO_ADMIN_USER}
      MONGO_ADMIN_PASS: ${MONGO_ADMIN_PASS}
  db:
    image: mongo
    container_name: ub-mongodb
    restart: unless-stopped
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 5s
      timeout: 10s
      retries: 5
    environment: # Add .env variables for this container
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ADMIN_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ADMIN_PASS}
    volumes:
      - mongodb:/data/db
  db_ui:
    image: mongo-express
    container_name: ub-mongo-express
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    ports: 
      - 3181:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: ${MONGO_ADMIN_USER}
      ME_CONFIG_MONGODB_ADMINPASSWORD: ${MONGO_ADMIN_PASS}
      ME_CONFIG_MONGODB_SERVER: ub-mongodb
    volumes:
      - mongo-express:/app/db

volumes: # It will prepend the project name
  mongodb:
  mongo-express:      
```

