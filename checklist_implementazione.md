# Checklist di implementazione

Ordine consigliato. Lavora su un tema duplicato (non pubblicato) fino al punto 10. Le voci "da verificare" dipendono da dati non presenti nel CONTESTO.

## 1. Verifiche preliminari
- [ ] Esportare i prodotti (CSV) come copia di sicurezza.
- [ ] Duplicare il tema attivo e lavorare sulla copia.
- [ ] Annotare piano Shopify, tema e versione, app installate (preventivi, filtri, SEO, traduzioni).
- [ ] Contare i prodotti per collezione e verificare se `ate-tools` e `automated-systems-and-tools-for-testing-and-production` contengono gli stessi prodotti.
- [ ] Elencare vendor (grafia esatta dei 12 marchi), product type e tag in uso, con duplicati e varianti.
- [ ] Rilevare gli handle reali di pagine (Contact, chi-siamo, certificazioni) e dei due blog.
- [ ] Esportare i redirect esistenti (Contenuti, Navigazione, Reindirizzamenti URL).
- [ ] Recuperare da Search Console le pagine con più traffico prima di cambiare handle.
- [ ] Recuperare l'URL del PDF della politica qualità.
- [ ] Decidere le domande aperte: pubblicazione in inglese, area B2B, gestione dei prezzi.

## 2. Creare i metafield
- [ ] Impostazioni, Dati personalizzati, Prodotti: creare le definizioni di `architettura.md` sezione 5 (namespace `custom`).
- [ ] Attivare l'uso nei filtri per i metafield indicati nella sezione 6.
- [ ] Verificare il tipo di ciascuno (testo, intero, elenco, file).

## 3. Riassegnare tag e product type
- [ ] Definire la tabella di conversione: vecchi tag e tipi verso `cat:`, `sub:`, `sett:`, `promo`, `novita`.
- [ ] Assegnare in blocco i tag (modifica in blocco o importazione CSV).
- [ ] Uniformare i product type secondo la sezione 4.1.
- [ ] Verificare che ogni prodotto abbia un solo `cat:` e un solo vendor con grafia corretta.
- [ ] Compilare i metafield di specifica almeno per i prodotti in evidenza.

## 4. Creare le collezioni
- [ ] Creare le 6 collezioni categoria (smart, tag `cat:`), riusando gli handle esistenti dove previsto (`data-acquisition`, `metrology`, `battery-and-fuel-cell-testing`).
- [ ] Rinominare `instrumentations`, `power`, `promotion` e unire le due collezioni ATE nel nuovo handle, spuntando "Crea un reindirizzamento URL" se il pannello lo propone (poi non importare la riga doppia).
- [ ] Creare le 19 sottocollezioni (smart, tag `sub:`). Non pubblicare quelle vuote.
- [ ] Creare le 12 collezioni per marchio (smart, Vendor uguale a).
- [ ] Creare `offerte`, `novita`, le 4 collezioni di settore (smart) e `in-evidenza` (manuale).
- [ ] Controllare i conteggi con quelli attesi.

## 5. Costruire i menu
- [ ] `main-menu`: Prodotti (categorie e sottocategorie), Marchi, Servizi, Settori, Risorse, Azienda.
- [ ] `utility-menu`: Offerte, Richiedi preventivo, Area riservata.
- [ ] Menu footer: `footer-prodotti`, `footer-servizi`, `footer-azienda`, `footer-policy`.
- [ ] Rimuovere "Info" e la voce "Quality" verso il PDF.
- [ ] Verificare che il mega menu sia disponibile nel tema; se no, valutare un tema o un'app di navigazione.

## 6. Configurare i filtri
- [ ] Search & Discovery, Filtri: impostare l'elenco per categoria (sezione 6).
- [ ] Aggiungere sinonimi e prodotti promossi in ricerca.
- [ ] Verificare come compaiono i filtri numerici e di testo nel tema.

## 7. Creare le pagine
- [ ] `servizi` (una pagina, 5 sezioni ancorate `#assistenza`, `#integrazione`, `#formazione`, `#installazione`, `#calibrazione`).
- [ ] `qualita-e-certificazioni` (testo, PDF collegato, certificazioni da verificare).
- [ ] `settori` (4 sezioni ancorate).
- [ ] `richiedi-preventivo` (modulo, vedi `architettura.md` sezione 10).
- [ ] `contatti`, `chi-siamo` (aggiornare), `marchi` (collection list).
- [ ] Creare i template alternativi necessari (`page.servizi`, `page.quotazione` e simili).
- [ ] Attivare Customer Accounts e valutare l'area B2B.

## 8. Importare i redirect
- [ ] Verificare gli handle reali di `/pages/contact` e delle pagine indicate nel CSV.
- [ ] Importare `redirect_301.csv` (Contenuti, Navigazione, Reindirizzamenti URL, Importa).
- [ ] Provare ogni URL vecchio nel browser.
- [ ] Aggiornare link interni per non passare dai redirect.

## 9. Home e template del tema
- [ ] Ordinare le sezioni della home come nell'anteprima (Modalità struttura, struttura proposta).
- [ ] Impostare nei template prodotto e collezione la modalità "richiedi quotazione" (rimuovere i blocchi prezzo e acquisto, se il tema lo consente).
- [ ] Titolo e meta description secondo i pattern di `architettura.md` sezione 12.
- [ ] Lasciare una sola newsletter (footer).

## 10. Verificare nell'anteprima del tema
- [ ] Controllare mobile e desktop, mega menu, filtri, ricerca, carrello, moduli.
- [ ] Controllare che nessuna voce di menu sia senza destinazione.
- [ ] Controllare i redirect e le pagine 404.
- [ ] Controllare accessibilità di base (contrasti, tastiera, testi alternativi).
- [ ] Far approvare i testi a ALLdata (le pagine sono segnaposto).

## 11. Pubblicare
- [ ] Pubblicare il tema.
- [ ] Inviare la sitemap aggiornata in Search Console e monitorare errori 404 e indicizzazione.
- [ ] Rivedere le collezioni vuote e i tag inutilizzati dopo due settimane.
