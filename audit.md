# Audit dello shop ALLdata

Fonte unica: il blocco CONTESTO fornito. Non ho accesso al sito reale. Ogni punto è marcato come **rilevato** (dichiarato nel CONTESTO) oppure **ipotesi** (dedotto in modo ragionevole, da confermare). Dove manca un dato scrivo "da verificare".

## 1. Sintesi dello stato attuale

### Navigazione
Il menu principale ha nove voci sullo stesso livello: Home, Test & Measurement, ATE & Tools, Power equipment, Contact, Education, News & Events, Quality, Info.

* Tre voci sono categorie di prodotto (collezioni `instrumentations`, `ate-tools`, `power`).
* Contact è una pagina, Education e News & Events sono blog.
* Quality apre direttamente un PDF, Info non ha destinazione.
* Mancano tre delle sei categorie che la home presenta: Data acquisition, Metrology, Battery and fuel cell testing.
* Non c'è gerarchia e quindi nemmeno un mega menu.

### Collezioni
Dal CONTESTO risultano almeno queste collezioni:

| Collezione | Uso noto |
|---|---|
| `instrumentations` | menu ("Test & Measurement"), footer, home ("T&M Instrumentation") |
| `ate-tools` | menu e footer ("ATE & Tools") |
| `automated-systems-and-tools-for-testing-and-production` | home, categoria ATE |
| `power` | menu, footer, home |
| `data-acquisition` | solo home |
| `metrology` | solo home |
| `battery-and-fuel-cell-testing` | solo home |
| `promotion` | home e footer |

Osservazione: `ate-tools` e `automated-systems-and-tools-for-testing-and-production` sembrano due collezioni per la stessa area. Il CONTESTO non lo dice in modo esplicito, quindi lo tratto come ipotesi. Non risultano collezioni per marchio.

### Home
La home ha nove blocchi:

1. Slideshow hero a tre slide.
2. Servizi tecnici, carosello di cinque voci.
3. Fascia di circa 32 loghi partner, senza link.
4. Promozioni.
5. Sei categorie di prodotto.
6. Chi siamo.
7. Get Professional Assistance, due box.
8. Insights & Events, quattro articoli.
9. Newsletter.

Non ci sono né prodotti né marchi in evidenza, né prezzi.

### Footer
Contiene indirizzo e contatti, quattro link rapidi, una seconda newsletter, i metodi di pagamento e le policy. Non porta a servizi, assistenza, certificazioni, settori o preventivo.

### Contenuti
* Il sito è in inglese, con URL in parte italiani (Contact, chi-siamo, certificazioni).
* Il blog eventi ha articoli recenti solo di marzo 2026, gli altri di luglio 2025. Education: aggiornamento da verificare.
* Le pagine informative (servizi, settori, qualità) non risultano come pagine autonome. I cinque servizi compaiono solo come carosello in home.

## 2. Criticità

### Rilevate (dichiarate nel CONTESTO)

| ID | Criticità |
|---|---|
| R1 | Stessa area con tre nomi: "Test & Measurement", "Instrumentations", "T&M Instrumentation". |
| R2 | Data acquisition, Metrology e Battery and fuel cell testing non sono nel menu. |
| R3 | "Info" senza destinazione. "Quality" apre un PDF, non una pagina. |
| R4 | Menu piatto che mescola prodotti, blog e pagine istituzionali. |
| R5 | Interfaccia in inglese con URL parzialmente in italiano. |
| R6 | Nessun prodotto o marchio in evidenza, nessun prezzo visibile. |
| R7 | Nessuna richiesta di preventivo né area riservata B2B visibile. |
| R8 | Footer povero: mancano servizi, assistenza, certificazioni. |
| R9 | Blog non aggiornato di recente. |
| R10 | Circa 32 loghi partner non collegati a collezioni per marchio. |
| R11 | Due moduli newsletter (home e footer). |
| R12 | Ricerca con solo filtro "Product type". |

### Ipotesi (dedotte, da confermare in admin)

| ID | Ipotesi |
|---|---|
| I1 | `ate-tools` e `automated-systems-and-tools-for-testing-and-production` sono collezioni sovrapposte per la stessa area (duplicazione o dispersione del traffico). |
| I2 | Le collezioni usano filtri generici (disponibilità, prezzo) e non filtri tecnici (banda, canali, potenza), perché il CONTESTO non ne cita. |
| I3 | Non ci sono metafield per schede tecniche e documenti, quindi le specifiche stanno probabilmente nella descrizione libera. |
| I4 | Tag e product type non seguono una convenzione unica (conseguenza probabile di R1). |
| I5 | Il prezzo non visibile può dipendere da prodotti a prezzo zero, bozza o nascosti da un'app. Da verificare. |
| I6 | Le certificazioni non hanno una pagina indicizzabile, quindi il PDF qualità non porta valore SEO. |
| I7 | I metodi di pagamento (Klarna, Apple Pay, Shop Pay) sono coerenti con un B2C, meno con un flusso di quotazione B2B. |
| I8 | Senza collezioni per marchio, le ricerche del tipo "[marchio] + [tipo strumento]" non trovano una pagina di atterraggio. |
| I9 | Titoli e meta description sono probabilmente non ottimizzati per categoria (assenza di pattern). |
| I10 | Il carosello servizi in home non ha link a pagine dedicate. |

## 3. Tabella problema, impatto, priorità

| Problema | Impatto | Priorità |
|---|---|---|
| Voce menu "Info" senza destinazione (R3) | Link morto, cattiva percezione di qualità | Alta |
| Tre nomi per la stessa area (R1) | Confusione utente, SEO dispersa | Alta |
| Tre categorie non nel menu (R2) | Prodotti raggiungibili solo dalla home, calo di scoperta | Alta |
| Nessuna richiesta di preventivo (R7) | Perdita di lead: in B2B è l'azione di conversione principale | Alta |
| Menu piatto (R4) | Difficoltà di orientamento, nessun mega menu | Alta |
| Nessuna collezione per marchio (R10, I8) | Nessuna landing per ricerche di marchio, loghi inutilizzati | Alta |
| "Quality" apre un PDF (R3, I6) | Nessuna pagina certificazioni indicizzabile, esperienza esterna al sito | Media |
| Filtri assenti o generici (I2, R12) | Ricerca lenta su cataloghi tecnici | Alta |
| Nessun metafield tecnico o documento (I3) | Schede prodotto povere, niente filtri per specifica | Alta |
| Nessun prodotto o marchio in home (R6) | Home poco orientata alla conversione | Media |
| Prezzi non visibili (R6, I5) | Serve un modello dichiarato: "Richiedi quotazione" | Media |
| Footer povero (R8) | Percorsi mancanti verso servizi e assistenza | Media |
| Lingua e URL misti (R5) | SEO locale debole | Media |
| Servizi senza pagina (I10) | Contenuto strategico non indicizzabile | Media |
| Due newsletter (R11) | Ridondanza | Bassa |
| Blog non aggiornato (R9) | Segnale di sito trascurato | Bassa |
| Pagamenti B2C per catalogo B2B (I7) | Incoerenza con il modello di quotazione | Bassa |

## 4. Informazioni da verificare nell'admin Shopify prima dell'implementazione

### Piano e configurazione
* Piano Shopify in uso (determina le funzioni B2B native). Da verificare.
* Tema installato, versione e sezioni disponibili. Da verificare.
* Mercati e lingue attive, presenza di Translate & Adapt. Da verificare.
* App installate (preventivi, filtri, SEO, traduzioni, newsletter). Da verificare.

### Prodotti e collezioni
* Numero di prodotti totale e per ciascuna collezione elencata sopra.
* Se `ate-tools` e `automated-systems-and-tools-for-testing-and-production` contengono gli stessi prodotti.
* Se le collezioni sono manuali o smart e con quali condizioni.
* Prodotti senza collezione o presenti in più collezioni.
* Se esiste già la collezione `promotion` come smart (su quale tag) e cosa contiene.
* Stato dei prodotti (attivi, bozza, archiviati) e canale di vendita.

### Tassonomia
* Elenco completo di vendor (grafia esatta dei 12 marchi e degli altri circa 20). Da verificare.
* Elenco dei product type esistenti e loro frequenza.
* Elenco dei tag in uso, con duplicati e varianti (maiuscole, lingua).
* Presenza di categorie standard Shopify assegnate ai prodotti.

### Metafield e contenuti
* Definizioni di metafield esistenti (prodotto, variante, collezione).
* Dove risiedono oggi le specifiche tecniche (descrizione, immagini, PDF caricati).
* Come sono pubblicati i documenti: file nella libreria, link esterni, allegati.
* Metaobject esistenti.

### Filtri e ricerca
* Filtri attivi in Search & Discovery e loro ordine.
* Sinonimi e prodotti promossi già configurati.
* Comportamento della ricerca con "Product type".

### Navigazione e SEO
* Menu di navigazione presenti (main, footer, altri).
* Reindirizzamenti già esistenti (Contenuti, Navigazione, Reindirizzamenti URL).
* Handle esatti di pagine e blog: `Contact`, `chi-siamo`, `certificazioni`, blog Education, blog News & Events. Da verificare.
* Template assegnati a home, collezioni, prodotti, pagine (`page.*`, `product.*`, `collection.*`).
* Title e meta description di collezioni e prodotti.
* URL del PDF della politica qualità e se altri file ospitati sono linkati esternamente.
* Performance SEO (Search Console): pagine con traffico da preservare prima di cambiare slug. Da verificare.
