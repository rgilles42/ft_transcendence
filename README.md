# ft_transcendence

Pour start en mode dev vous avez 2 possibilités

- Ouvrir un shell pour le front et pour le back et les lancer en direct dans les dossier app

- Lancer le tout avec docker et bosser dans les dossier app (sachant qu'il faut restart les containers etc..). Brf c'est plus simple de garder juste la DB et PGadmin sur docker le rest en local pour debug et bosser

Pour lancer sur full docker:

`
docker-compose -f docker-compose.dev.yml up (-d pour detach du shell) --build (service particulier ou vide pour tout lancer)
`

Pour lancer independament

`
Front (frontend/app):
npm install
npm run serve

Back (backend/app):
npm install
(migrations à venir)
npm run start:dev

DB (racine):
docker-compose -f docker-compose.dev.yml up --build postgres

PGadmin (racine | optionnel, perso j'utilise heidiSQL sur windows)
docker-compose -f docker-compose.dev.yml up --build pgadmin
`

j'ai surrement oublier des choses..
Sorry d'avance
