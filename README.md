# Démonstration opentelemetry on nodejs

## Lancement

### Stack

Aller sous le répertoire et lancer la stack

```shell
docker compose up 
```

### Api

```shell
npm run start-api
```

### BFF

```shell
npm run start-bff
```

## Test

Exécuter des commandes sur le BFF

```shell
curl  http://localhost:8081/users/titi
curl  http://localhost:8081/users/toto
curl  http://localhost:8081/users
```

Observer dans [grafana](http://localhost:3000) les traces (exporre -> tempo) ou les métriques (explore -> prometheus).
