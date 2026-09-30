# Nuova architettura del sito ALLdata

Tutto ciò che segue si realizza con funzioni standard di Shopify: menu di navigazione, collezioni manuali e smart, metafield, Search & Discovery, template e sezioni del tema Online Store 2.0, reindirizzamenti URL. Dove una scelta richiede un'app o una piccola modifica al tema lo dichiaro esplicitamente.

Legenda dei riferimenti: **R1 a R12** e **I1 a I10** rimandano alle criticità di `audit.md`.

Ipotesi di base adottate (da confermare):
* Lingua principale italiano, con termini tecnici e marchi in inglese. Inglese come seconda lingua tramite Shopify Markets (vedi sezione 12).
* Modello commerciale "Richiedi quotazione": nessun prezzo pubblico. Nell'anteprima i prezzi non compaiono.
* Sono usati solo i 12 marchi citati nel CONTESTO. Gli altri partner sono "da verificare".
* Piano Shopify, handle di pagine e blog, vendor esatti: "da verificare".

---

## 1. Sitemap

Massimo tre livelli di navigazione. I prodotti sono le pagine foglia e non contano come livello.

```
Home
1. Prodotti (pagina indice delle categorie, mega menu)
   1.1 Test & Measurement
       1.1.1 Oscilloscopi
       1.1.2 Analizzatori di spettro
       1.1.3 Generatori di funzioni
       1.1.4 Multimetri
   1.2 Data Acquisition
       1.2.1 Sistemi multicanale
       1.2.2 Sistemi modulari
       1.2.3 Sistemi distribuiti
   1.3 Power Supplies & Loads
       1.3.1 Alimentatori DC programmabili
       1.3.2 Alimentatori AC programmabili
       1.3.3 Carichi elettronici
   1.4 ATE & Production Test
       1.4.1 Sistemi di test automatico
       1.4.2 Strumenti per la produzione
   1.5 Metrology & Calibration
       1.5.1 Metrologia elettrica
       1.5.2 Pressione
       1.5.3 Temperatura
       1.5.4 Forza
   1.6 Battery & Fuel Cell Testing
       1.6.1 Cycler per celle
       1.6.2 Cycler per moduli e pack
       1.6.3 Fuel cell ed elettrolizzatori
2. Marchi
   2.1 Indice marchi (pagina)
   2.2 Una collezione per ciascuno dei 12 marchi
3. Servizi (pagina unica con ancore)
   3.1 Assistenza tecnica e commerciale
   3.2 System integration
   3.3 Formazione
   3.4 Installazione
   3.5 Calibrazione
4. Settori (pagina unica con ancore)
   4.1 Difesa
   4.2 Aerospazio
   4.3 Energia
   4.4 Ricerca
5. Risorse
   5.1 Guide tecniche (blog Education)
   5.2 News & Eventi (blog eventi)
6. Azienda
   6.1 Chi siamo
   6.2 Qualità e certificazioni (pagina vera)
   6.3 Contatti
Utility (menu secondario)
   Offerte (collezione)
   Richiedi preventivo (pagina)
   Account e area riservata (Shopify Customer Accounts)
   Cerca (ricerca, carrello o lista richieste)
```

Perché: gerarchia esplicita per risolvere R4, tutte e sei le categorie raggiungibili dal menu per risolvere R2, "Info" eliminata e "Quality" trasformata in pagina per risolvere R3.

---

## 2. Menu di navigazione

Solo menu standard di Shopify (Contenuti, Menu). Massimo 3 livelli per menu.

### 2.1 Menu principale (handle `main-menu`)

| Livello 1 | Livello 2 | Livello 3 | Note |
|---|---|---|---|
| **Prodotti** (mega menu) | le 6 categorie | le sottocategorie | Link su `/collections/all` oppure alla pagina indice. Vedi 2.4. |
| Marchi (link alla pagina Marchi) | i 12 marchi | nessuno | Dropdown semplice. |
| Servizi | Assistenza, System integration, Formazione, Installazione, Calibrazione | nessuno | Link a `/pages/servizi#ancora`. |
| Settori | Difesa, Aerospazio, Energia, Ricerca | nessuno | Link a `/pages/settori#ancora`. |
| Risorse | Guide tecniche, News & Eventi | nessuno | Blog. |
| Azienda | Chi siamo, Qualità e certificazioni, Contatti | nessuno | Sostituisce "Quality" (PDF) e "Info". |

Perché: sei voci per la leggibilità, blog e istituzionali separati dai prodotti (R4), naming unico delle categorie (R1).

### 2.2 Menu utility (handle `utility-menu`)
Offerte, Richiedi preventivo, Area riservata. Nel tema si mostra nella barra annunci o accanto alle icone. Il pulsante evidenziato "Richiedi preventivo" dipende dallo stile del tema; in alternativa è una voce di testo (da verificare nel tema).

### 2.3 Menu footer (quattro menu distinti)
* `footer-prodotti`: le 6 categorie.
* `footer-servizi`: Assistenza tecnica, System integration, Formazione, Installazione, Calibrazione, Richiedi preventivo.
* `footer-azienda`: Chi siamo, Qualità e certificazioni, Settori, News & Eventi, Contatti.
* `footer-policy`: Privacy, Termini di servizio, Spedizioni, Rimborsi, Contatti (link alle policy Shopify).

Il footer include inoltre indirizzo e contatti (blocco testo), un solo modulo newsletter e i metodi di pagamento.

Perché: risolve R8 (footer povero) e R11 (una sola newsletter).

### 2.4 Mega menu "Prodotti"
Lo standard Shopify Online Store 2.0 supporta tre livelli. Se il tema non ha un mega menu nativo (verificare, molti temi lo includono), lo si ottiene con l'opzione "Mega menu" del header (da verificare) oppure con app di navigazione. La struttura dati resta la stessa.

Il pannello mostra le 6 categorie come colonne, ciascuna con le proprie sottocategorie e il link "Vedi tutto". Nella colonna finale: Marchi in evidenza e Offerte.

---

## 3. Collezioni

Naming: titolo in italiano tranne nomi propri e nomi di categoria in inglese. Handle in minuscolo con trattini, senza duplicati e senza abbreviazioni.

Legenda condizioni smart: tutte devono essere soddisfatte quando indicato "E" ("Il prodotto deve soddisfare tutte le condizioni").

### 3.1 Categorie principali (6, smart)

| Titolo | Handle | Regola | Sostituisce |
|---|---|---|---|
| Test & Measurement | `test-and-measurement` | Tag uguale a `cat:test-measurement` | `instrumentations` |
| Data Acquisition | `data-acquisition` | Tag uguale a `cat:data-acquisition` | invariato |
| Power Supplies & Loads | `power-supplies-and-loads` | Tag uguale a `cat:power` | `power` |
| ATE & Production Test | `ate-production-test` | Tag uguale a `cat:ate` | `ate-tools` e `automated-systems-and-tools-for-testing-and-production` |
| Metrology & Calibration | `metrology` | Tag uguale a `cat:metrology` | invariato |
| Battery & Fuel Cell Testing | `battery-and-fuel-cell-testing` | Tag uguale a `cat:battery-fuel-cell` | invariato |

Perché: un solo nome e un solo handle per area (R1, I1). Gli handle già corretti restano per non creare redirect inutili.

### 3.2 Sottocategorie (19, smart)

| Titolo | Handle | Regola |
|---|---|---|
| Oscilloscopi | `oscilloscopi` | Tag `sub:oscilloscopi` |
| Analizzatori di spettro | `analizzatori-di-spettro` | Tag `sub:analizzatori-spettro` |
| Generatori di funzioni | `generatori-di-funzioni` | Tag `sub:generatori-funzioni` |
| Multimetri | `multimetri` | Tag `sub:multimetri` |
| Sistemi multicanale | `acquisizione-multicanale` | Tag `sub:daq-multicanale` |
| Sistemi modulari | `acquisizione-modulare` | Tag `sub:daq-modulare` |
| Sistemi distribuiti | `acquisizione-distribuita` | Tag `sub:daq-distribuita` |
| Alimentatori DC programmabili | `alimentatori-dc-programmabili` | Tag `sub:alimentatori-dc` |
| Alimentatori AC programmabili | `alimentatori-ac-programmabili` | Tag `sub:alimentatori-ac` |
| Carichi elettronici | `carichi-elettronici` | Tag `sub:carichi` |
| Sistemi di test automatico | `sistemi-di-test-automatico` | Tag `sub:ate-sistemi` |
| Strumenti per la produzione | `strumenti-per-la-produzione` | Tag `sub:ate-produzione` |
| Metrologia elettrica | `metrologia-elettrica` | Tag `sub:metro-elettrica` |
| Pressione | `metrologia-pressione` | Tag `sub:metro-pressione` |
| Temperatura | `metrologia-temperatura` | Tag `sub:metro-temperatura` |
| Forza | `metrologia-forza` | Tag `sub:metro-forza` |
| Cycler per celle | `cycler-celle` | Tag `sub:battery-celle` |
| Cycler per moduli e pack | `cycler-moduli-e-pack` | Tag `sub:battery-pack` |
| Fuel cell ed elettrolizzatori | `fuel-cell-ed-elettrolizzatori` | Tag `sub:fuel-cell` |

Nota: le sottocategorie derivano dalle descrizioni di categoria del CONTESTO. Che esistano prodotti per ciascuna è "da verificare". Una sottocategoria vuota non va pubblicata nel menu.

### 3.3 Marchi (12, smart)

Regola per tutti: **Vendor uguale a** il nome esatto del marchio. La grafia esatta del vendor in admin è "da verificare".

| Titolo | Handle | Regola |
|---|---|---|
| Rohde & Schwarz | `rohde-schwarz` | Vendor = `Rohde & Schwarz` |
| Teradyne | `teradyne` | Vendor = `Teradyne` |
| Honeywell | `honeywell` | Vendor = `Honeywell` |
| GW Instek | `gw-instek` | Vendor = `GW Instek` |
| Knick | `knick` | Vendor = `Knick` |
| Astronics | `astronics` | Vendor = `Astronics` |
| Data I/O | `data-io` | Vendor = `Data I/O` |
| TDI Power | `tdi-power` | Vendor = `TDI Power` |
| Transmille | `transmille` | Vendor = `Transmille` |
| Neware | `neware` | Vendor = `Neware` |
| North Atlantic Industries | `north-atlantic-industries` | Vendor = `North Atlantic Industries` |
| JTAG Technologies | `jtag-technologies` | Vendor = `JTAG Technologies` |

Gli altri circa 20 loghi della fascia partner sono "da verificare" e si aggiungono con la stessa regola.

Perché: la fascia partner oggi non è cliccabile (R10, I8). Con una collezione per marchio i loghi diventano link.

### 3.4 Altre collezioni

| Titolo | Handle | Tipo | Regola |
|---|---|---|---|
| Offerte | `offerte` | Smart | Tag `promo`. Sostituisce `promotion`. |
| In evidenza | `in-evidenza` | **Manuale** | Selezione a mano per la home. |
| Novità | `novita` | Smart | Tag `novita`. Da svuotare periodicamente. |
| Difesa | `settore-difesa` | Smart | Tag `sett:difesa` |
| Aerospazio | `settore-aerospazio` | Smart | Tag `sett:aerospazio` |
| Energia | `settore-energia` | Smart | Tag `sett:energia` |
| Ricerca | `settore-ricerca` | Smart | Tag `sett:ricerca` |

Le collezioni di settore sono opzionali: servono alla pagina Settori come sezione "featured collection".

Nota sulle condizioni con metafield: le collezioni smart possono usare condizioni su metafield solo per le definizioni che lo abilitano (opzione "collezioni smart"). Per semplicità e robustezza uso i tag per le categorie e il vendor per i marchi. I metafield servono a schede e filtri.

---

## 4. Tassonomia di prodotto

### 4.1 Product type (valori singolari, iniziale maiuscola)
Oscilloscopio, Analizzatore di spettro, Generatore di funzioni, Multimetro, Sistema di acquisizione dati, Alimentatore DC programmabile, Alimentatore AC programmabile, Carico elettronico, Sistema di test automatico, Strumento per la produzione, Strumento di metrologia elettrica, Strumento di pressione, Strumento di temperatura, Strumento di forza, Cycler per batterie, Sistema per fuel cell ed elettrolizzatori.

Regola: un solo tipo per prodotto, mai il nome del marchio o della categoria nel tipo. L'elenco reale è "da verificare" (I4).

### 4.2 Vendor
Il vendor è il marchio, con grafia identica al nome usato nella collezione (vedi 3.3). Un solo vendor per prodotto.

### 4.3 Tag e naming convention

Formato: `prefisso:valore`, minuscolo, senza spazi, valori con trattino.

| Prefisso | Uso | Esempi |
|---|---|---|
| `cat:` | categoria principale (uno per prodotto) | `cat:power` |
| `sub:` | sottocategoria (uno o più) | `sub:carichi` |
| `sett:` | settore applicativo (zero o più) | `sett:difesa` |
| `promo` | prodotto in offerta | `promo` |
| `novita` | nuovo prodotto | `novita` |

Regola: i tag guidano solo le collezioni. Le specifiche tecniche vanno nei metafield, non nei tag.

### 4.4 Naming di prodotto
* Titolo: `{Tipo}, {Marchio} {Modello}`. Esempio (ESEMPIO): "Oscilloscopio, MARCHIO MODELLO-ESEMPIO".
* Handle: `{marchio}-{modello}` in minuscolo.
* SKU: codice costruttore.
* Testo alternativo immagini: `{Tipo} {Marchio} {Modello}, vista frontale`.

---

## 5. Metafield consigliati

Namespace `custom` (quello che l'admin assegna alle definizioni create dal pannello). Tutti gli esempi di valore sono **ESEMPIO** e non sono dati reali.

### 5.1 Specifiche (prodotto)

| Nome | Namespace.chiave | Tipo | Esempio di valore (ESEMPIO) |
|---|---|---|---|
| Codice costruttore | `custom.codice_costruttore` | Testo a riga singola | `MOD-ESEMPIO-01` |
| Banda | `custom.banda` | Testo a riga singola | `200 MHz` |
| Canali | `custom.canali` | Numero intero | `4` |
| Frequenza di campionamento | `custom.freq_campionamento` | Testo a riga singola | `1 GS/s` |
| Risoluzione (bit) | `custom.risoluzione_bit` | Numero intero | `12` |
| Potenza massima | `custom.potenza_max` | Testo a riga singola | `1200 W` |
| Tensione massima | `custom.tensione_max` | Testo a riga singola | `60 V` |
| Corrente massima | `custom.corrente_max` | Testo a riga singola | `40 A` |
| Interfacce | `custom.interfaccia` | Elenco di testi a riga singola | `USB`, `LAN`, `GPIB` |
| Grandezza misurata | `custom.grandezza_misurata` | Elenco di testi | `Tensione`, `Pressione` |
| Campo di misura | `custom.campo_misura` | Testo a riga singola | `0 a 100 V` |
| Accuratezza | `custom.accuratezza` | Testo a riga singola | `0,05 %` |
| Tecnologia di test | `custom.tecnologia_test` | Elenco di testi | `Boundary scan` |
| Architettura | `custom.architettura` | Testo a riga singola | `Modulare` |
| Temperatura di esercizio | `custom.temp_esercizio` | Testo a riga singola | `0 a 40 °C` |
| Settori applicativi | `custom.settori` | Elenco di testi | `Difesa`, `Ricerca` |
| Specifiche estese | `custom.specifiche_estese` | Testo multilinea o rich text | tabella o elenco a riga |

### 5.2 Documenti e conformità (prodotto)

| Nome | Namespace.chiave | Tipo | Esempio (ESEMPIO) |
|---|---|---|---|
| Scheda tecnica | `custom.scheda_tecnica` | File (PDF) | `scheda-modello-esempio.pdf` |
| Manuale utente | `custom.manuale_utente` | File (PDF) | `manuale-modello-esempio.pdf` |
| Dichiarazione di conformità | `custom.dichiarazione_conformita` | File (PDF) | `dichiarazione-esempio.pdf` |
| Documenti aggiuntivi | `custom.documenti_extra` | Elenco di file | disegni, note applicative |
| Certificazioni del prodotto | `custom.certificazioni_prodotto` | Elenco di testi | da verificare |
| Link scheda produttore | `custom.link_produttore` | URL | `https://esempio.invalid/` |

### 5.3 Regole di utilizzo
* I valori con unità usano formato uniforme: numero, spazio, unità (`200 MHz`). Serve ai filtri che si comportano come elenchi.
* Un metafield si compila solo dove ha senso per il tipo di prodotto. Le definizioni vuote non appaiono nei filtri.
* Ordine dei campi nella scheda: dal più rilevante al meno rilevante per la scelta di acquisto.

Perché: le specifiche oggi sono probabilmente nel testo libero (I3), quindi non filtrabili né riusabili.

---

## 6. Filtri per Shopify Search & Discovery

Ordine consigliato per categoria. Fonte: Ricerca e scoperta, Filtri. Aggiungere i filtri "Marchio" (vendor) e "Settore applicativo" come comuni a tutte.

Nota tecnica: i filtri su metafield numerici si presentano come elenco di valori (non come cursore). Per questo `banda`, `potenza_max` e simili sono testi con unità standardizzate. Il supporto esatto dei tipi di filtro va "da verificare" in admin.

| Categoria | Filtri, in ordine |
|---|---|
| Test & Measurement | Tipo di strumento (product type), Banda, Canali, Interfacce, Marchio, Settore |
| Data Acquisition | Architettura, Canali, Frequenza di campionamento, Risoluzione (bit), Interfacce, Marchio |
| Power Supplies & Loads | Tipo (product type), Potenza massima, Tensione massima, Corrente massima, Canali, Interfacce, Marchio |
| ATE & Production Test | Tipo di sistema (product type), Tecnologia di test, Canali, Interfacce, Marchio, Settore |
| Metrology & Calibration | Grandezza misurata, Campo di misura, Accuratezza, Tipo (product type), Marchio |
| Battery & Fuel Cell Testing | Tipo (product type), Canali, Tensione massima, Corrente massima, Marchio, Settore |

Impostazioni: ordinamento predefinito "In evidenza" o "Titolo, A a Z". Se il tema non nasconde i prezzi, "Prezzo" non va attivato nei filtri (modello a quotazione). Sinonimi consigliati (Search & Discovery): scope, oscilloscope e oscilloscopio; PSU e alimentatore; DAQ e acquisizione dati.

Perché: filtri tecnici al posto di filtri generici (I2, R12).

---

## 7. Template consigliati

Nomi di sezione come nel tema Online Store 2.0 di riferimento (Dawn e derivati). Le sezioni disponibili variano con il tema, da verificare.

| Template | Sezioni consigliate |
|---|---|
| **Home** (`index`) | `announcement-bar`, `header`, `slideshow`, `multicolumn` (fiducia), `collection-list` (6 categorie), `featured-collection` (In evidenza), `collection-list` (Marchi), `multicolumn` (Servizi), `multicolumn` (Settori), `image-with-text` (Preventivo e area riservata), `image-banner` (Offerte), `image-with-text` (Qualità), `featured-blog` (News & Eventi), `footer` |
| **Collezione** (`collection`) | `main-collection-banner` (titolo, descrizione), `main-collection-product-grid` (filtri e ordinamento), `rich-text` (testo SEO e guida alla scelta), `collapsible-content` (domande frequenti), `collection-list` (sottocategorie) |
| **Prodotto** (`product`, variante `product.quotazione`) | `main-product` (galleria, titolo, marchio, varianti, pulsante di richiesta), blocco `collapsible-content` per Specifiche tecniche, blocco per Documenti, `product-recommendations` (correlati), `rich-text` (assistenza) |
| **Pagina** (`page`) | `main-page` (titolo e testo). Varianti: `page.servizi`, `page.qualita`, `page.settori`, `page.quotazione`, `page.contatti` |
| **Blog** (`blog`) | `main-blog` con filtro per tag, `email-signup-banner` |
| **Articolo** (`article`) | `main-article`, sezione articoli collegati |
| **Ricerca** (`search`) | `main-search` con filtri (Search & Discovery), `rich-text` di aiuto se zero risultati |
| **Carrello** (`cart`) | `main-cart-items`, `main-cart-footer`. Nel modello a quotazione si usa come "lista richiesta" (vedi sezione 10). |
| **Contatti** (`page.contatti`) | `contact-form`, `multicolumn` (indirizzo, telefono, email), `rich-text` (orari da verificare), mappa se il tema la prevede |

Nota: nel template prodotto, nascondere il prezzo e i pulsanti di acquisto è possibile rimuovendo i blocchi Prezzo e Pulsanti di acquisto dall'editor del tema. Se le carte prodotto nelle collezioni mostrano comunque il prezzo, serve una piccola modifica al tema o un'app (da verificare).

---

## 8. Nuova home

| # | Sezione (nome Shopify) | Obiettivo | Criticità risolta |
|---|---|---|---|
| 1 | `announcement-bar` | Messaggio breve con contatto e invito a chiedere una quotazione | R7 |
| 2 | `header` | Logo, menu con mega menu, ricerca, account, richiesta | R2, R4 |
| 3 | `slideshow` | Claim istituzionale e due azioni: sfoglia prodotti, richiedi preventivo | R7 |
| 4 | `multicolumn` (fiducia) | Dal 1980, settori serviti, supporto tecnico, certificazioni | R6 |
| 5 | `collection-list` (categorie) | Le 6 categorie con descrizione breve, nomi coerenti | R1, R2 |
| 6 | `featured-collection` | Prodotti in evidenza (collezione manuale) | R6 |
| 7 | `collection-list` (marchi) | I 12 marchi come link alle collezioni | R10 |
| 8 | `multicolumn` (servizi) | I 5 servizi con link alle ancore della pagina Servizi | I10 |
| 9 | `multicolumn` (settori) | Difesa, Aerospazio, Energia, Ricerca | R6 |
| 10 | `image-with-text` (preventivo e area riservata) | Spiega assistenza pre e post vendita, invita al preventivo | R7 |
| 11 | `image-banner` (offerte) | Porta alla collezione Offerte | R6 |
| 12 | `image-with-text` (qualità) | Certificazioni con link alla pagina vera | R3 |
| 13 | `featured-blog` | Ultimi tre articoli di News & Eventi | R9 |
| 14 | `footer` | Menu, contatti, unica newsletter, pagamenti, policy | R8, R11 |

Il modulo newsletter resta solo nel footer. I blocchi "Chi siamo" e "Get Professional Assistance" sono ripresi in `image-with-text` e nel footer.

---

## 9. Pagine e contenuti da creare o riscrivere

I testi sono da scrivere con l'azienda. Nell'anteprima uso testi di esempio, etichettati.

| Pagina | Handle proposto | Template | Contenuto minimo |
|---|---|---|---|
| **Servizi** | `servizi` | `page.servizi` | Pagina unica con cinque sezioni ancorate: assistenza, integrazione, formazione, installazione, calibrazione. Ogni sezione: a chi serve, cosa include, come richiederlo. Fonte dei testi: CONTESTO (consulenza ingegneristica, supporto tecnico, installazione, formazione, servizi industriali personalizzati). |
| **Qualità e certificazioni** | `qualita-e-certificazioni` | `page.qualita` | Politica qualità come testo, PDF come download, elenco certificazioni (da verificare), riferimenti a Difesa, Aerospazio, Energia, Ricerca. Sostituisce il PDF come destinazione del menu. |
| **Settori** | `settori` | `page.settori` | Quattro sezioni ancorate con applicazioni tipiche (da verificare) e collezione collegata. |
| **Richiedi preventivo** | `richiedi-preventivo` | `page.quotazione` | Modulo con dati azienda, prodotto di interesse, quantità, note. Vedi sezione 10. |
| **Chi siamo** | `chi-siamo` | `page` | Storia dal 1980, oltre 45 anni di esperienza, sede di Cinisello Balsamo, collegamento a Qualità e Servizi. Handle invariato. |
| **Contatti** | `contatti` | `page.contatti` | Indirizzo, telefono, email, modulo. Sostituisce `contact`. |
| **Marchi** | `marchi` | `page` con `collection-list` | Elenco dei marchi con logo e link alle collezioni. |
| **Area riservata** | (sistema) | Customer Accounts | Accesso e registrazione. |

Perché: risolve R3, R8, R7 e I10.

---

## 10. Richiesta di preventivo e area B2B

### Preventivo (obiettivo: trasformare il carrello in richiesta di quotazione)

| Opzione | Come | Limiti | Codice o app |
|---|---|---|---|
| **A. Solo funzioni native** | Pagina `richiedi-preventivo` con sezione `contact-form`. Sul prodotto, blocco testo con link alla pagina. | Pochi campi, nessun link automatico al prodotto. Il cliente scrive il codice nel messaggio. | Nessuna app, nessun codice. |
| **B. Shopify Forms** | App ufficiale gratuita di Shopify per moduli con campi personalizzati. Aggiunta come blocco nella pagina. | Verificare campi disponibili e notifiche. | App gratuita. |
| **C. App di preventivi** | Nell'App Store esistono app "Request a Quote" o "Hide price" che sostituiscono il pulsante di acquisto con la richiesta e raccolgono l'elenco prodotti. | Costo mensile, dati in un servizio esterno. Da valutare in App Store. | App. |
| **D. Carrello come lista richiesta** | Si lasciano attivi carrello e checkout con pagamento "su ordine" (bonifico manuale o bozza ordine), e i prezzi si concordano dopo. | Il checkout può mostrare prezzi; richiede prodotti con prezzo simbolico. Non consigliato per prezzi non pubblici. | Nessun codice ma impatta la contabilità. |

Raccomandazione: partire con A o B (nessun costo), poi valutare C se i volumi lo giustificano. Notifiche email a `info@alldata.it` e, se attivo, collegamento a Klaviyo o Shopify Flow (da verificare).

### Area riservata B2B

| Opzione | Come | Requisiti |
|---|---|---|
| **Customer Accounts** | Account cliente nativo con storico ordini e dati aziendali. | Sempre disponibile. |
| **B2B nativo Shopify** | Company, listini per cliente, condizioni di pagamento. | Dipende dal piano (da verificare, tipicamente Plus). |
| **Accesso a contenuti e prezzi per tag cliente** | Prezzi o documenti visibili solo ai clienti con tag `b2b`. | Richiede app di controllo accessi (per esempio Locksmith) o modifica al tema. |

Raccomandazione: attivare Customer Accounts subito e lasciare l'area riservata come fase due.

---

## 11. Piano dei redirect 301

File importabile: `redirect_301.csv` (Contenuti, Navigazione, Reindirizzamenti URL, Importa). Colonne: `Redirect from`, `Redirect to`.

| Da | A | Motivo |
|---|---|---|
| `/collections/instrumentations` | `/collections/test-and-measurement` | Naming unico (R1) |
| `/collections/ate-tools` | `/collections/ate-production-test` | Unione (I1) |
| `/collections/automated-systems-and-tools-for-testing-and-production` | `/collections/ate-production-test` | Unione (I1), slug più corto |
| `/collections/power` | `/collections/power-supplies-and-loads` | Chiarezza |
| `/collections/promotion` | `/collections/offerte` | Italiano (R5) |
| `/pages/contact` | `/pages/contatti` | Italiano (R5). Handle attuale da verificare. |
| `/pages/certificazioni` | `/pages/qualita-e-certificazioni` | Pagina qualità vera (R3) |

Non richiedono redirect: `data-acquisition`, `metrology`, `battery-and-fuel-cell-testing` (handle invariati), `/pages/chi-siamo` (invariato).

Note operative:
* Shopify non accetta caratteri jolly nei redirect. Gli URL di prodotto con collezione nel percorso (`/collections/xxx/products/yyy`) non sono coperti da questo elenco: da verificare se servono.
* Se rinomini l'handle direttamente dalla collezione, Shopify offre la casella "Crea un reindirizzamento URL": in tal caso non importare la riga corrispondente.
* Gli handle dei blog non sono nel CONTESTO: nessun redirect proposto, da verificare.
* Dopo la migrazione, aggiornare i menu e i link interni per non passare dai redirect.

---

## 12. Indicazioni SEO

### Pattern di title (max circa 60 caratteri) e meta description (max circa 155)

| Tipo | Title | Meta description |
|---|---|---|
| Categoria | `{Categoria} \| ALLdata` | `Strumentazione per {ambito} per laboratori, R&D e produzione. Consulenza tecnica dal 1980 e quotazione su richiesta.` |
| Sottocategoria | `{Sottocategoria}: {Categoria} \| ALLdata` | `{Sottocategoria} professionali: scegli per {due specifiche} e richiedi una quotazione ad ALLdata.` |
| Marchio | `{Marchio}: strumentazione \| ALLdata` | `Prodotti {Marchio} disponibili tramite ALLdata: consulenza, installazione e assistenza tecnica.` |
| Prodotto | `{Tipo} {Marchio} {Modello} \| ALLdata` | `{Tipo} {Marchio} {Modello}: {specifica 1}, {specifica 2}. Richiedi quotazione e scheda tecnica.` |

Per i marchi la formulazione "disponibili tramite ALLdata" è un'ipotesi: da verificare il tipo di rapporto commerciale prima di usarla.

### URL e lingua
* Handle in italiano dove si tratta di pagine e sottocategorie, in inglese dove il nome è di uso tecnico internazionale (per esempio `data-acquisition`).
* Prodotto: `/products/{marchio}-{modello}`. Non cambiare handle di prodotti già indicizzati senza redirect.
* Lingua: interfaccia italiana come lingua principale, inglese come seconda lingua con Shopify Markets (sottocartella `/en/`) e Translate & Adapt per le traduzioni. Il tag hreflang è generato dal tema quando i mercati sono configurati (da verificare). Traduzione dei menu e degli handle: da valutare in Translate & Adapt.
* Una sola lingua per pagina, senza mescolare titoli italiani e inglesi.

### Dati strutturati
* Prodotto: il markup `Product` è presente nei temi standard. Senza prezzo pubblico serve un controllo (offerte assenti). Da verificare nel test dei risultati avanzati di Google.
* Organizzazione e LocalBusiness (indirizzo, telefono, email di Cinisello Balsamo): richiedono uno snippet aggiuntivo nel tema o un'app SEO. Da valutare.
* Breadcrumb: verificare se il tema li emette. Altrimenti app SEO.
* Sitemap XML: generata da Shopify. Verificare che le collezioni vuote non siano indicizzate.
