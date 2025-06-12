#!/bin/sh

# Charger les variables d'environnement à partir de .env.staging
set -a
. "$(dirname "$0")/../.env.staging"
set +a

# Utilise la variable MYSQL_CONTAINER_NAME définie dans .env.staging
echo "⏳ Attente que MySQL soit prêt (container: $MYSQL_CONTAINER_NAME)..."
until [ "$(docker inspect --format='{{.State.Health.Status}}' "$MYSQL_CONTAINER_NAME")" = "healthy" ]; do
  sleep 2
done
echo "✅ MySQL est prêt !"
