# Amsterdam 750 - Engineering Case Study

Statische portfoliosite over een serverless pre-registratieconcept voor
Amsterdam 750. De site zelf gebruikt bewust alleen semantische HTML en CSS:
geen React-runtime, client-side state, database of applicatie-authenticatie.

## Technische opzet

- Vite bouwt `index.html` en `styles.css` naar `dist/`.
- `@cloudflare/vite-plugin` configureert een assets-only Cloudflare-deployment.
- `build/sites-vite-plugin.ts` kopieert uitsluitend de hostingmetadata naar het
  buildartefact.
- De publieke site bevat geen ChatGPT-sign-inroutes of identity-headerlogica.
- `public/evidence/load-test-methodology.html` beschrijft de loadtestresultaten,
  interpretatie en beperkingen.
- `public/evidence/artifacts/` bevat de originele Azure-input, resultaten en
  logs, een berekende JSON-samenvatting en SHA-256-checksums.

De eerdere Next.js/vinext-, React-, D1-, Drizzle- en ChatGPT-authscaffolding is
verwijderd omdat de portfoliosite die functionaliteit niet gebruikt.

## Commando's

```text
npm run dev        lokale ontwikkelserver
npm run typecheck  TypeScript-controle van de Vite- en buildconfiguratie
npm run lint       ESLint voor configuratie en tests
npm run build      productiebuild
npm test           build plus controles op HTML, links en assets
npm start          Cloudflare/Vite-preview van de productiebuild
```

Node.js 22.13 of nieuwer is vereist.

## Publieke repository

De site verwijst naar:

https://github.com/Gozzy82/amsterdam750-public

Publiceer deze checkout daar samen met de oorspronkelijke, geschoonde
loadtestartefacten. Publiceer nooit secrets, tokens, echte persoonsgegevens of
ongeanonimiseerde testdata.

De publiek toegankelijke portfoliosite wordt vanuit `main` naar GitHub Pages
gedeployed:

https://gozzy82.github.io/amsterdam750-public/

## Bewijsstatus

De gepubliceerde brondata beschrijft een vijf minuten durende Azure Load
Testing-run met 250 virtuele gebruikers. De ruwe CSV bevat 126.124 succesvolle
POST-registraties, 126.129 CORS-preflights en geen fouten. Berekend over de
POST-resultaten bedraagt de throughput 420,57 requests per seconde en de p95
634 ms. Zie de methodologiepagina voor definities, downloads en beperkingen.

## Publieke toegang

De applicatie en de GitHub Pages-deployment bevatten geen authenticatie. De
Pages-workflow voert voor iedere deployment eerst typecheck, lint, build en
tests uit.
