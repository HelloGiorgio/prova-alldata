# ALLdata, nuova struttura dello shop

Proposta di riorganizzazione dello shop Shopify di ALLdata e anteprima interattiva navigabile.
Tutto è costruito sul solo blocco CONTESTO. Nessun dato reale del negozio è stato letto: dove manca un dato è scritto "da verificare", e i prodotti dell'anteprima sono contenuti di esempio marcati **ESEMPIO**.

## Contenuto del repository

| File | Cosa contiene |
|---|---|
| `audit.md` | Stato attuale, criticità (rilevate e ipotesi), priorità, verifiche da fare in admin |
| `architettura.md` | Sitemap, menu, collezioni, tassonomia, metafield, filtri, template, home, pagine, preventivo e B2B, redirect, SEO |
| `redirect_301.csv` | Redirect pronti da importare in Shopify |
| `checklist_implementazione.md` | Passi ordinati per applicare la proposta |
| `preview/` | Anteprima statica, senza build |

## Come aprire l'anteprima

Apri `preview/index.html` con un doppio clic. Funziona da file locale, senza server e senza connessione (nessuna dipendenza esterna, font di sistema).

Nell'anteprima:
* **Struttura attuale / Struttura proposta** (barra in alto): confronta menu, collezioni e home. La struttura attuale è ricostruita dal CONTESTO (con i problemi segnalati, per esempio "Info" senza destinazione).
* **Modalità struttura**: mostra sulla pagina, con riquadri tratteggiati e un pannello laterale, a quale template, sezione o blocco Shopify corrisponde ogni parte (`header`, `featured-collection`, `main-product` e così via), con l'obiettivo di ciascuna.
* **Riepilogo struttura**: elenco di menu, ordine della home, collezioni e redirect della struttura scelta.
* Collezioni con filtri e ordinamento funzionanti, scheda prodotto con galleria, varianti, specifiche, documenti e correlati, pagine Servizi, Qualità e certificazioni, Settori, Marchi, Preventivo, Contatti, Carrello (usato come lista richiesta).
* In struttura proposta, aprendo un vecchio URL (per esempio la collezione `instrumentations`) si vede il redirect 301 applicato.

## Come modificare la struttura dal file JSON

Fonte unica: `preview/data/structure.json`. Contiene:

| Chiave | Cosa controlla |
|---|---|
| `shop` | Contatti e metodi di pagamento |
| `categories` | Le sei categorie con sottocategorie, tag e descrizione. Alimentano mega menu, collezioni, home e footer |
| `brands` | I marchi, usati come collezioni per vendor, fascia marchi e menu |
| `otherCollections` | Offerte, In evidenza, Novità, settori (con regola o selezione manuale) |
| `metafields` | Metafield mostrati nella tabella delle specifiche |
| `filters` | Filtri per categoria (`source`: `vendor`, `type`, `category` oppure `attr:chiave`) |
| `redirects` | Coppie da, a (applicate nell'anteprima) |
| `current` | Menu, collezioni, home e footer attuali |
| `proposed` | Barra annunci, menu, menu utility, menu footer, home |
| `pages`, `blogs` | Pagine e blog |

I prodotti stanno in `preview/data/products.json`.

**Dopo ogni modifica** esegui, dalla cartella `preview`:

```
node tools/sync-data.js
```

Il comando rigenera `data/structure.js` e `data/products.js`, che sono i file effettivamente caricati dalla pagina (il browser blocca la lettura diretta dei JSON quando la pagina è aperta con doppio clic). Non modificare i file `.js` a mano. Serve Node.js, nessuna installazione di pacchetti.

Esempi:
* Rinominare una categoria: cambia `title` in `categories`, poi esegui lo script. Menu, home, footer, filtri e collezione si aggiornano.
* Riordinare la home: cambia l'ordine degli elementi in `proposed.home`.
* Aggiungere un marchio: aggiungi una voce a `brands` (con `vendor` identico al vendor in Shopify).
* Aggiungere un prodotto di esempio: aggiungi un oggetto a `products.json`, con tag `cat:`, `sub:` coerenti.

## Come tradurre la proposta in azioni nell'admin Shopify

Il percorso completo è in `checklist_implementazione.md`. In sintesi:

1. **Verifiche preliminari** (`audit.md`, sezione 4): vendor, tag, tipi, collezioni esistenti, handle di pagine e blog, redirect, tema.
2. **Metafield**: Impostazioni, Dati personalizzati, Prodotti. Namespace `custom`, chiavi come in `architettura.md`, sezione 5.
3. **Collezioni**: Prodotti, Collezioni. Smart con le condizioni della sezione 3 (tag o vendor), una manuale (`in-evidenza`).
4. **Tag e product type**: assegnazione in blocco (modifica in blocco dei prodotti o importazione CSV) secondo la convenzione della sezione 4.
5. **Menu**: Contenuti, Navigazione. Il mega menu è il menu principale a tre livelli (vedi sezione 2).
6. **Filtri**: app Search & Discovery, filtri per categoria (sezione 6).
7. **Pagine**: Contenuti, Pagine, con template alternativi.
8. **Redirect**: Contenuti, Navigazione, Reindirizzamenti URL, Importa `redirect_301.csv`.
9. **Home e template**: Personalizza tema, sezioni come nella modalità struttura dell'anteprima.
10. **Anteprima del tema e pubblicazione**: prima come tema duplicato, poi pubblica.

## Limiti dell'anteprima

* I prezzi non sono mostrati per scelta ("Richiedi quotazione").
* L'associazione fra marchio, categoria e modello dei prodotti è un esempio e non descrive il catalogo reale.
* Il mega menu, i filtri e il carrello imitano il comportamento standard dei temi Online Store 2.0. Nomi e disponibilità delle sezioni dipendono dal tema realmente installato, da verificare.
* Nessun dato inviato dai moduli.
