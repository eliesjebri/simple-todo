# ----------------------------
# Étape 1 : Build + Tests unitaires
# ----------------------------
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copier le code et les tests
COPY . .

ENV NODE_ENV=test
ENV LOG_LEVEL=debug
ENV CI=true

# Argument pour invalider le cache dans CI
ARG TEST_RUN_TAG=none
ENV TEST_RUN_TAG=$TEST_RUN_TAG

# Lister les tests qui seront lancés (utile pour debug CI)
RUN yarn test:unit:build --listTests --verbose  --silent=false --colors --detectOpenHandles

# Argument de scope (valeurs : functional, e2e, all)
ARG TEST_SCOPE=all    

RUN echo "🧪 Lancement des tests unitaires - TAG: $TEST_RUN_TAG" && \
    if [ "$TEST_SCOPE" = "fail" ]; then \
      echo "💥 Test volontairement KO" && \
      yarn test:unit:fail --verbose --silent=false --colors --detectOpenHandles; \
    else \
      echo "✅ Lancer tous les tests unitaires (OK seulement)" && \
      yarn test:unit:build --verbose  --silent=false --colors --detectOpenHandles; \
    fi

# ----------------------------
# Étape 2 : Base pour tests d'intégration
# ----------------------------
FROM build AS test

# Environnement pour les tests d'intégration
ENV NODE_ENV=test
ENV CI=true

# Les variables MySQL seront injectées à l’exécution (docker run)
ARG MYSQL_HOST
ARG MYSQL_USER
ARG MYSQL_PASSWORD
ARG MYSQL_DB
ENV MYSQL_HOST=$MYSQL_HOST
ENV MYSQL_USER=$MYSQL_USER
ENV MYSQL_PASSWORD=$MYSQL_PASSWORD
ENV MYSQL_DB=$MYSQL_DB

CMD ["yarn", "test:integration:test", "--verbose", "--silent=false", "--colors", "--detectOpenHandles"]

# ----------------------------
# Étape 3 : Base pour tests fonctionnels (staging)
# ----------------------------
FROM build AS staging

# Environnement pour staging
COPY .env.staging .env

ARG TEST_SCOPE=all
ENV TEST_SCOPE=$TEST_SCOPE
ENV NODE_ENV=staging
ENV LOG_LEVEL=debug
ENV CI=true

ARG MYSQL_HOST
ARG MYSQL_USER
ARG MYSQL_PASSWORD
ARG MYSQL_DB
ENV MYSQL_HOST=$MYSQL_HOST
ENV MYSQL_USER=$MYSQL_USER
ENV MYSQL_PASSWORD=$MYSQL_PASSWORD
ENV MYSQL_DB=$MYSQL_DB

RUN echo "🧪 Lancement tests staging - TAG: $TEST_RUN_TAG" && \
    if [ "$TEST_SCOPE" = "functional" ]; then \
        yarn test:functional:staging --verbose --silent=false --colors --detectOpenHandles ; \
    elif [ "$TEST_SCOPE" = "e2e" ]; then \
        echo "🧪 [TODO] Tests E2E pas encore implémentés (placeholder)" && \
        echo "✅ Simulation réussite E2E (future implémentation)" ; \
    else \
        yarn test:functional:staging --verbose --silent=false --colors --detectOpenHandles && \
        echo "🧪 [TODO] Tests E2E pas encore implémentés (placeholder)" && \
        echo "✅ Simulation réussite E2E (future implémentation)" ; \
    fi

# ----------------------------
# Étape 4 : Image de production clean
# ----------------------------
FROM node:18-alpine AS prod

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copier uniquement les sources (sans les tests)
COPY src ./src
COPY static ./static
COPY .env.production .env

ENV NODE_ENV=production
ENV LOG_LEVEL=info
EXPOSE 3000

CMD ["node", "src/index.js"]
