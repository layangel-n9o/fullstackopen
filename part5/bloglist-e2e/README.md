# Bloglist — tests E2E (partie 5)

Tests de bout en bout Playwright pour l'application Bloglist.

## Prérequis

1. Lancer le backend en mode test (base `bloglist-test`, endpoint
   `/api/testing/reset` activé) :

   ```bash
   cd ../../part4/bloglist-backend
   npm run start:test
   ```

2. Lancer le frontend en mode dev :

   ```bash
   cd ../bloglist-frontend
   npm run dev
   ```

## Lancer les tests

```bash
npm install
npx playwright install
npm test
```
