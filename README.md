# ft_transcendence

To deploy the prod app, run
```sh
docker-compose up --build
```

There are two ways to run in dev mode.

1) Opening front and back separately in two shells and launch them directly in their `/app` subfolder, and let the DB be dockerized. This is recommended if you intend to work on the app.
- Front (frontend/app):
```sh
npm install
npm run serve
```
- Back (backend/app):
```sh
npm install
npm run start:dev
```
- DB (project root folder):
```sh
docker-compose -f docker-compose.dev.yml up --build postgres
```
- PGadmin (project root folder; optional, native alternatives exist, such as HeidiSQL on windows or DBeaver on UNIXes)
```sh
docker-compose -f docker-compose.dev.yml up --build pgadmin
```


2) Deploy everything in Docker and still work on the `/app` subfolders (but the containers will have to be rebuilt at any change).
```sh
docker-compose -f docker-compose.dev.yml up (-d to detach shell) --build <service|leave empty to deploy everything>
```