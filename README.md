# Full Stack Open — parties 1 à 5

Dépôt des exercices du cours Full Stack Open (Université d'Helsinki).

Annuaire en ligne : [Ouvrir le Phonebook](https://fullstackopen-vr5c.onrender.com/)

## Organisation

```
fullstackopen/
  part0/           ex. 0.4 - 0.6   : diagrammes de séquence (mermaid)

  part1/
    courseinfo/    ex. 1.1 - 1.5   : composants et props
    unicafe/       ex. 1.6 - 1.11  : état, statistiques, tableau HTML
    anecdotes/     ex. 1.12 - 1.14 : anecdotes et votes

  part2/
    courseinfo/    ex. 2.1 - 2.5   : map, reduce, module Course
    phonebook/     ex. 2.6 - 2.17  : formulaires, axios, json-server, notifications
    countries/     ex. 2.18 - 2.20 : API REST pays + météo

  part3/
    phonebook-backend/  ex. 3.1 - 3.22 : Express, MongoDB, validation

  part4/
    bloglist-backend/   ex. 4.1 - 4.23 : API blogs, JWT, tests node:test

  part5/
    bloglist-frontend/  ex. 5.1 - 5.31 : React, tests Vitest, React Router
    bloglist-e2e/       ex. 5.17 - 5.23, 5.28 : tests Playwright
```

## Utilisation rapide

Pour chaque projet frontend (part1, part2, part5) :

```bash
cd <projet>
npm install
npm run dev
```

### Phonebook (partie 2)

Le frontend appelle `/api/persons` (proxy Vite vers `localhost:3001`).
Deux backends possibles :

- json-server : `npm run server` dans `part2/phonebook`
- le backend Express de `part3/phonebook-backend` (`npm run dev`)

### Backend Phonebook (partie 3)

```bash
cd part3/phonebook-backend
npm install
# créer .env (voir .env.example) avec MONGODB_URI et PORT
npm run dev
```

### Bloglist backend (partie 4)

```bash
cd part4/bloglist-backend
npm install
# créer .env (voir .env.example) : MONGODB_URI, TEST_MONGODB_URI, PORT, SECRET
npm run dev
npm test          # tests unitaires + tests d'API (supertest)
```

### Bloglist frontend (partie 5)

```bash
cd part5/bloglist-frontend
npm install
npm run dev       # proxy /api -> localhost:3003
npm test          # tests Vitest
```

### Tests E2E (partie 5)

```bash
cd part5/bloglist-e2e
npm install
npx playwright install
npm test          # backend (mode test) + frontend dev doivent tourner
```

## Remarques

- Aucun `node_modules` ni `.env` n'est versionné.
- Les secrets (MongoDB, clé météo, SECRET JWT) se configurent dans des
  fichiers `.env` locaux (voir les `.env.example` de chaque projet).
