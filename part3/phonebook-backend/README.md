# Phonebook — backend (partie 3)

API REST Express + MongoDB pour l'application Phonebook de la partie 2.

## Lancer en local

```bash
npm install
```

Créer un fichier `.env` à la racine (voir `.env.example`) :

```
MONGODB_URI=mongodb+srv://<utilisateur>:<mot_de_passe>@cluster0.mongodb.net/phonebookApp?retryWrites=true&w=majority
PORT=3001
```

Puis :

```bash
npm run dev    # développement (node --watch)
npm start      # production
```

Le serveur écoute sur le port 3001.

## Routes de l'API

| Méthode | Route             | Description                        |
| ------- | ----------------- | ---------------------------------- |
| GET     | `/info`           | nombre de contacts + date          |
| GET     | `/api/persons`    | liste des contacts                 |
| GET     | `/api/persons/:id`| un contact (404 si inconnu)        |
| POST    | `/api/persons`    | ajoute un contact (JSON: name, number) |
| PUT     | `/api/persons/:id`| modifie le numéro d'un contact     |
| DELETE  | `/api/persons/:id`| supprime un contact                |

Le nom doit faire au moins 3 caractères. Le numéro doit faire au moins 8
caractères et être de la forme `XX-XXXX...` ou `XXX-XXXX...` (2 ou 3
chiffres, un tiret, puis uniquement des chiffres).

## Frontend en production

Le dossier `dist/` contient le build de production du frontend React
(généré depuis `part2/phonebook` avec `npm run build`, puis copié ici).
Express le sert à la racine grâce à `express.static('dist')`.

## Application déployée

À compléter après déploiement (Render, Fly.io, etc.) :
https://...

## Script mongo.js

```bash
node mongo.js <mot_de_passe>                    # liste les contacts
node mongo.js <mot_de_passe> "Nom" "Numero"     # ajoute un contact
```

Penser à adapter l'URL du cluster dans `mongo.js`.
