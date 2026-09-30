/* Anteprima ALLdata. JavaScript vanilla, nessuna dipendenza.
 * Tutta la struttura (menu, collezioni, home, filtri, pagine, redirect) arriva da data/structure.js,
 * generato da data/structure.json. I prodotti arrivano da data/products.js (products.json).
 * Routing con hash: gli URL dell'anteprima ricalcolano i percorsi Shopify (#/collections/xxx). */
(function () {
  'use strict';

  const S = window.ALLDATA_STRUCTURE;
  const PR = window.ALLDATA_PRODUCTS;
  const $ = (id) => document.getElementById(id);
  if (!S || !PR) {
    $('main').textContent = 'Dati mancanti. Esegui: node tools/sync-data.js';
    return;
  }
  const P = PR.products;

  /* ---------- Stato e persistenza ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('alldata.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('alldata.' + k, JSON.stringify(v)); } catch (e) { /* ignora */ } }
  };
  const state = {
    mode: store.get('mode', 'proposed') === 'current' ? 'current' : 'proposed',
    structure: !!store.get('structure', false),
    cart: store.get('cart', []),
    path: '/',
    redirectNote: null
  };
  const isCur = () => state.mode === 'current';

  const STR = {
    it: { cart: 'Richiesta', account: 'Area riservata', searchPh: 'Cerca prodotti o marchi', searchLabel: 'Cerca nel sito', searchBtn: 'Cerca', menu: 'Menu', price: 'Prezzo su quotazione', add: 'Aggiungi alla richiesta', cartTitle: 'Lista richiesta di quotazione', home: 'Home' },
    en: { cart: 'Cart', account: 'Log in', searchPh: 'Search', searchLabel: 'Search', searchBtn: 'Search', menu: 'Menu', price: 'Prezzo non visibile', add: 'Add to cart', cartTitle: 'Cart', home: 'Home' }
  };
  const T = () => (isCur() ? STR.en : STR.it);

  /* ---------- Utilità DOM ---------- */
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) c.forEach((x) => add(el, x));
    else if (c.nodeType) el.appendChild(c);
    else el.appendChild(document.createTextNode(String(c)));
  }
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        const v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      });
    }
    kids.forEach((c) => add(el, c));
    return el;
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const slug = (s) => String(s).toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const ex = () => h('span', { class: 'badge-ex', title: 'Contenuto di esempio' }, 'ESEMPIO');
  const href = (u) => {
    if (u === '' || u == null) return '#/dead-link';
    if (/^https?:|^mailto:|^tel:/.test(u)) return u;
    if (u === '/') return '#/';
    return '#' + u.replace('#', '@');
  };
  const natural = (a, b) => String(a).localeCompare(String(b), 'it', { numeric: true });

  function ph(alt, label, ratio, cls, corner) {
    const w = 800, hh = Math.round(w * (ratio || 0.75));
    const lab = esc(String(label || '').slice(0, 42));
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + hh + '"><rect width="100%" height="100%" fill="#e4e9f0"/>' +
      '<path d="M0 0L' + w + ' ' + hh + 'M' + w + ' 0L0 ' + hh + '" stroke="#c3ccd9" stroke-width="2"/>' +
      (corner
        ? '<rect x="' + (w - 340) + '" y="' + (hh - 74) + '" width="320" height="56" rx="8" fill="#fff" stroke="#8b97aa"/>' +
          '<text x="' + (w - 180) + '" y="' + (hh - 50) + '" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="#243044">SEGNAPOSTO IMMAGINE</text>' +
          '<text x="' + (w - 180) + '" y="' + (hh - 28) + '" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#3b475a">' + lab + '</text></svg>'
        : '<rect x="' + (w / 2 - 210) + '" y="' + (hh / 2 - 38) + '" width="420" height="76" rx="8" fill="#fff" stroke="#8b97aa"/>' +
          '<text x="50%" y="' + (hh / 2 - 6) + '" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#243044">SEGNAPOSTO IMMAGINE</text>' +
          '<text x="50%" y="' + (hh / 2 + 24) + '" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" fill="#3b475a">' + lab + '</text></svg>');;
    return h('img', { class: cls || '', src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg), alt: alt, width: String(w), height: String(hh), loading: 'lazy' });
  }

  /* Elemento che corrisponde a una sezione, un template o un blocco Shopify. */
  function shp(tag, meta, ...kids) {
    const a = {
      class: 'sec ' + (meta.cls || ''),
      'data-shopify': meta.name,
      'data-label': meta.label || '',
      'data-goal': meta.goal || '',
      'data-kind': meta.kind || 'section',
      'data-issue': meta.issue || null,
      id: meta.id || null
    };
    return h(tag, a, ...kids);
  }

  /* ---------- Dati derivati ---------- */
  const catById = (id) => S.categories.find((c) => c.id === id);
  const catTitle = (p) => (catById(p.cat) || {}).title || '';
  const brandHandle = (vendor) => { const b = S.brands.find((x) => x.vendor === vendor); return b ? b.handle : null; };

  function resolveLinks(list) {
    if (list === '@categories') {
      return S.categories.map((c) => ({ label: c.title, title: c.title, text: c.description, url: '/collections/' + c.handle, children: c.subs.map((s) => ({ label: s.title, url: '/collections/' + s.handle })) }));
    }
    if (list === '@brands') return S.brands.map((b) => ({ label: b.title, title: b.title, url: '/collections/' + b.handle, text: '' }));
    return list || [];
  }

  const colCache = {};
  function collections() {
    if (colCache[state.mode]) return colCache[state.mode];
    let out = [];
    if (isCur()) {
      out = S.current.collections.map((c) => Object.assign({ kind: 'current' }, c));
    } else {
      S.categories.forEach((c) => {
        out.push({ handle: c.handle, title: c.title, description: c.description, type: 'smart', rule: 'Tag uguale a ' + c.tag, match: { tag: c.tag }, kind: 'category', cat: c.id, subs: c.subs });
        c.subs.forEach((s) => out.push({ handle: s.handle, title: s.title, description: '', type: 'smart', rule: 'Tag uguale a ' + s.tag, match: { tag: s.tag }, kind: 'sub', cat: c.id, parent: c }));
      });
      S.brands.forEach((b) => out.push({ handle: b.handle, title: b.title, description: 'Prodotti ' + b.title + ' del catalogo di esempio.', type: 'smart', rule: 'Vendor uguale a ' + b.vendor, match: { vendor: b.vendor }, kind: 'brand' }));
      S.otherCollections.forEach((o) => out.push(Object.assign({ kind: 'other' }, o)));
    }
    colCache[state.mode] = out;
    return out;
  }
  function findCollection(handle) {
    if (handle === 'all') return { handle: 'all', title: isCur() ? 'All products' : 'Tutti i prodotti', description: '', type: 'smart', rule: 'Collezione predefinita di Shopify', match: { all: true }, kind: 'other' };
    return collections().find((c) => c.handle === handle) || null;
  }
  function members(col) {
    const m = col.match || {};
    return P.filter((p) => {
      if (m.all) return true;
      if (m.tag) return p.tags.indexOf(m.tag) > -1;
      if (m.vendor) return p.vendor === m.vendor;
      if (m.featured) return p.featured;
      return false;
    });
  }
  const findProduct = (handle) => P.find((p) => p.handle === handle);

  /* ---------- Carrello ---------- */
  const cartCount = () => state.cart.reduce((n, l) => n + l.qty, 0);
  function saveCart() { store.set('cart', state.cart); const el = $('cart-count'); if (el) el.textContent = String(cartCount()); }
  function addToCart(pid, opts, qty) {
    const key = pid + '|' + JSON.stringify(opts);
    const line = state.cart.find((l) => l.key === key);
    if (line) line.qty += qty; else state.cart.push({ key, pid, opts, qty });
    saveCart();
  }
  let toastTimer = null;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
  }

  /* ---------- Blocchi comuni ---------- */
  const heading = (text, level) => (text ? h('h' + (level || 2), { class: 'sec__title', text }) : null);
  function productCard(p) {
    const b = brandHandle(p.vendor);
    return h('article', { class: 'card' },
      h('a', { class: 'card__media', href: href('/products/' + p.handle), tabindex: '-1', 'aria-hidden': 'true' }, ph(p.title + ', immagine segnaposto', p.code, 0.75)),
      h('div', { class: 'card__body' },
        h('p', { class: 'card__vendor', text: p.vendor }),
        h('h3', { class: 'card__title' }, h('a', { href: href('/products/' + p.handle), text: p.title })),
        h('p', { class: 'card__meta' }, 'Modello ', h('span', { text: p.code }), ' ', ex()),
        h('p', { class: 'card__price', text: T().price })
      ));
  }
  const productGrid = (list) => h('div', { class: 'grid' }, list.map(productCard));
  function crumbs(items) {
    return h('nav', { class: 'crumbs', 'aria-label': 'Percorso' }, h('ol', null, items.map((it, i) =>
      h('li', null, it.url && i < items.length - 1 ? h('a', { href: href(it.url), text: it.label }) : h('span', { 'aria-current': 'page', text: it.label })))));
  }
  const devNote = (text) => h('aside', { class: 'dev-note' }, h('strong', null, 'Come si realizza in Shopify. '), text);
  const btn = (label, url, cls) => h('a', { class: 'btn ' + (cls || ''), href: href(url), text: label });

  /* ---------- Testata: barra annunci, header, menu ---------- */
  function renderAnnouncement() {
    const el = $('announcement');
    el.innerHTML = '';
    if (isCur()) return;
    const a = S.proposed.announcement;
    el.appendChild(shp('div', { name: 'announcement-bar', label: 'Barra annunci', goal: 'Messaggio breve con contatto e invito al preventivo.', cls: 'announcement' },
      h('div', { class: 'container announcement__row' },
        h('p', null, a.text + ' ', h('a', { href: href(a.url), text: a.cta })),
        h('ul', { class: 'announcement__links' }, S.proposed.utilityMenu.filter((u) => u.url !== a.url).map((u) => h('li', null, h('a', { href: href(u.url), text: u.label })))))));
  }

  const desktop = () => window.matchMedia('(min-width: 1000px)').matches;
  function closeMenus(except) {
    document.querySelectorAll('.nav__item.open').forEach((li) => {
      if (li === except) return;
      li.classList.remove('open');
      const b = li.querySelector('.nav__toggle');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  function openMenu(li) {
    closeMenus(li);
    li.classList.add('open');
    const b = li.querySelector('.nav__toggle');
    if (b) b.setAttribute('aria-expanded', 'true');
  }

  function buildNav() {
    const items = isCur() ? S.current.menu : S.proposed.menu;
    const ul = h('ul', { class: 'nav__list' });
    items.forEach((it, i) => {
      const li = h('li', { class: 'nav__item' });
      const kids = it.children ? resolveLinks(it.children) : null;
      const linkAttrs = { class: 'nav__link', href: href(it.url), text: it.label, 'data-issue': it.issue || null };
      if (it.url && it.url.split('#')[0] === state.path) linkAttrs['aria-current'] = 'page';
      if (!kids) { li.appendChild(h('a', linkAttrs)); ul.appendChild(li); return; }
      const id = 'sub-' + i;
      li.appendChild(h('div', { class: 'nav__split' }, h('a', linkAttrs),
        h('button', { class: 'nav__toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': id, 'aria-label': 'Mostra il sottomenu di ' + it.label,
          onclick: () => { li.classList.contains('open') ? closeMenus() : openMenu(li); updatePanel(); } }, h('span', { 'aria-hidden': 'true', text: '▾' }))));
      let panel;
      if (it.mega) {
        panel = shp('div', { name: 'mega-menu', label: 'Mega menu Prodotti', kind: 'block', goal: 'Menu di navigazione a 3 livelli: categoria, sottocategoria. Ogni categoria e ogni sottocategoria è una collezione.', cls: 'nav__panel nav__panel--mega', id },
          h('div', { class: 'mega' },
            kids.map((c) => h('div', { class: 'mega__col' }, h('a', { class: 'mega__head', href: href(c.url), text: c.label }), h('ul', null, c.children.map((s) => h('li', null, h('a', { href: href(s.url), text: s.label })))))),
            it.featured ? h('div', { class: 'mega__col mega__col--featured' }, h('p', { class: 'mega__head', text: 'In evidenza' }), h('ul', null, it.featured.map((f) => h('li', null, h('a', { href: href(f.url), text: f.label }))))) : null));
      } else {
        panel = h('div', { class: 'nav__panel', id }, h('ul', { class: 'dropdown' }, kids.map((c) => h('li', null, h('a', { href: href(c.url), text: c.label })))));
      }
      li.appendChild(panel);
      li.addEventListener('mouseenter', () => { if (desktop()) { openMenu(li); updatePanel(); } });
      li.addEventListener('mouseleave', () => { if (desktop()) { closeMenus(); updatePanel(); } });
      li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) { li.classList.remove('open'); const b = li.querySelector('.nav__toggle'); if (b) b.setAttribute('aria-expanded', 'false'); } });
      ul.appendChild(li);
    });
    return ul;
  }

  function renderHeader() {
    const t = T();
    const el = $('header');
    el.innerHTML = '';
    const types = Array.from(new Set(P.map((p) => p.type))).sort(natural);
    const form = h('form', { class: 'search', role: 'search', onsubmit: (e) => {
      e.preventDefault();
      const q = form.elements.q.value.trim();
      const ty = form.elements.type ? form.elements.type.value : '';
      location.hash = '#/search?q=' + encodeURIComponent(q) + (ty ? '&type=' + encodeURIComponent(ty) : '');
    } },
      isCur() ? h('span', { class: 'search__type', 'data-issue': 'Filtro Product type' }, h('label', { class: 'sr-only', for: 'ptype', text: 'Product type' }), h('select', { id: 'ptype', name: 'type' }, h('option', { value: '', text: 'Product type' }), types.map((x) => h('option', { value: x, text: x })))) : null,
      h('label', { class: 'sr-only', for: 'q', text: t.searchLabel }),
      h('input', { id: 'q', name: 'q', type: 'search', placeholder: t.searchPh, autocomplete: 'off' }),
      h('button', { class: 'btn btn--small', type: 'submit', text: t.searchBtn }));
    const toggle = h('button', { class: 'menu-toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'primary-nav', onclick: () => {
      const open = el.querySelector('.site-header').classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    } }, h('span', { class: 'menu-toggle__icon', 'aria-hidden': 'true' }), h('span', { text: t.menu }));
    const nav = shp('nav', { name: 'header › menu di navigazione', label: 'Menu principale', kind: 'block', goal: isCur() ? 'Nove voci sullo stesso livello, senza gerarchia.' : 'Sei voci con gerarchia: Prodotti (mega menu), Marchi, Servizi, Settori, Risorse, Azienda.', cls: 'nav', id: 'primary-nav' }, buildNav());
    nav.setAttribute('aria-label', 'Menu principale');
    const header = shp('header', { name: 'header', label: 'Testata', goal: isCur() ? 'Logo, ricerca con filtro Product type, login, carrello.' : 'Logo, menu con mega menu, ricerca, account, richiesta di quotazione.', cls: 'site-header' },
      h('div', { class: 'container header__row' }, toggle,
        h('a', { class: 'logo', href: href('/'), 'aria-label': 'ALLdata, torna alla home' }, 'ALL', h('span', { text: 'data' })),
        nav, form,
        h('a', { class: 'icon-link', href: href('/account'), text: t.account }),
        h('a', { class: 'icon-link icon-link--cart', href: href('/cart') }, t.cart, ' ', h('span', { class: 'cart-count', id: 'cart-count', text: String(cartCount()) }), h('span', { class: 'sr-only', text: ' articoli' }))));
    el.appendChild(header);
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const el = $('footer');
    el.innerHTML = '';
    const sh = S.shop;
    const contact = h('div', { class: 'foot__col' }, h('a', { class: 'logo logo--foot', href: href('/'), 'aria-label': 'ALLdata' }, 'ALL', h('span', { text: 'data' })),
      h('address', null, sh.address, h('br'), 'Tel. ', h('a', { href: 'tel:+390266015566', text: sh.phone }), h('br'), h('a', { href: 'mailto:' + sh.email, text: sh.email })));
    const news = shp('div', { name: 'footer › newsletter', label: 'Iscrizione newsletter', kind: 'block', goal: 'Unico modulo newsletter del sito.', issue: isCur() ? 'R11' : '', cls: 'foot__col' },
      h('h2', { class: 'foot__title', text: 'Newsletter' }),
      h('form', { class: 'inline-form', onsubmit: (e) => { e.preventDefault(); toast('Anteprima: nessun dato inviato.'); } },
        h('label', { class: 'sr-only', for: 'nl-foot', text: 'Indirizzo email' }), h('input', { id: 'nl-foot', type: 'email', required: true, placeholder: isCur() ? 'Email' : 'La tua email' }),
        h('button', { class: 'btn btn--small', type: 'submit', text: isCur() ? 'Subscribe' : 'Iscriviti' })));
    let cols;
    if (isCur()) {
      cols = [contact,
        h('div', { class: 'foot__col' }, h('h2', { class: 'foot__title', text: 'Quick links' }), h('ul', null, S.current.footer.quick.map((l) => h('li', null, h('a', { href: href(l.url), text: l.label }))))),
        h('div', { class: 'foot__col' }, h('h2', { class: 'foot__title', text: 'Policies' }), h('ul', null, [['Privacy policy', '/policies/privacy-policy'], ['Terms of service', '/policies/terms-of-service'], ['Shipping policy', '/policies/shipping-policy'], ['Contact', '/pages/contact'], ['Refund policy', '/policies/refund-policy']].map((l) => h('li', null, h('a', { href: href(l[1]), text: l[0] }))))),
        news];
    } else {
      cols = [contact].concat(S.proposed.footerMenus.map((m) => h('nav', { class: 'foot__col', 'aria-label': m.title }, h('h2', { class: 'foot__title', text: m.title }),
        h('ul', null, resolveLinks(m.items).map((l) => h('li', null, h('a', { href: href(l.url), text: l.label }))))))).concat([news]);
    }
    const foot = shp('footer', { name: 'footer', label: 'Piè di pagina', goal: isCur() ? 'Contatti, quattro link rapidi, seconda newsletter, pagamenti, policy.' : 'Contatti, quattro menu (prodotti, servizi, azienda, policy), un solo modulo newsletter, pagamenti.', cls: 'site-footer' },
      h('div', { class: 'container foot__grid' }, cols),
      h('div', { class: 'container foot__bottom' },
        h('ul', { class: 'payments', 'aria-label': 'Metodi di pagamento' }, sh.payments.map((x) => h('li', { text: x }))),
        h('p', { class: 'copy', text: '© ' + new Date().getFullYear() + ' ALLdata. Anteprima con contenuti di esempio.' })));
    el.appendChild(foot);
  }

  /* ---------- Sezioni home ---------- */
  function rSlideshow(sec) {
    const slides = sec.settings.slides;
    let idx = 0;
    const stage = h('div', { class: 'slide-stage', 'aria-live': 'polite' });
    const counter = h('span', { class: 'slide-count' });
    function draw() {
      const s = slides[idx];
      stage.innerHTML = '';
      stage.appendChild(h('div', { class: 'slide' }, ph('Immagine segnaposto: ' + (s.image || s.title), s.image, 0.42, 'slide__img', true),
        h('div', { class: 'slide__text' }, h('h1', { text: s.title }), s.text ? h('p', { text: s.text }) : null,
          h('div', { class: 'slide__cta' }, s.cta ? btn(s.cta, s.url) : null, s.cta2 ? btn(s.cta2, s.url2, 'btn--light') : null))));
      counter.textContent = (idx + 1) + ' / ' + slides.length;
    }
    draw();
    const go = (d) => { idx = (idx + d + slides.length) % slides.length; draw(); };
    return shp('section', { name: sec.shopify, label: sec.label, goal: sec.goal, issue: sec.issue || sec.solves, cls: 'slideshow' }, stage,
      h('div', { class: 'slide-controls' }, h('button', { class: 'btn btn--small btn--ghost', type: 'button', onclick: () => go(-1), 'aria-label': 'Slide precedente', text: '‹' }), counter,
        h('button', { class: 'btn btn--small btn--ghost', type: 'button', onclick: () => go(1), 'aria-label': 'Slide successiva', text: '›' })));
  }
  function rMulti(sec) {
    const st = sec.settings;
    const cols = (st.columns || []).map((c) => {
      const inner = [h('h3', { text: c.title }), c.text ? h('p', { text: c.text }) : null];
      return c.url ? h('a', { class: 'col', href: href(c.url) }, inner) : h('div', { class: 'col col--static' }, inner);
    });
    return shp('section', { name: sec.shopify, label: sec.label, goal: sec.goal, issue: sec.issue || sec.solves, cls: 'container' },
      heading(st.heading), h('div', { class: 'cols' + (st.carousel ? ' cols--carousel' : '') + (st.style === 'compact' ? ' cols--compact' : '') + ((st.columns || []).length === 5 ? ' cols--five' : ''), role: 'list' }, cols.map((c) => { c.setAttribute('role', 'listitem'); return c; })));
  }
  function rLogos(sec) {
    const st = sec.settings;
    const items = resolveLinks(st.brands).map((b) => (st.link === false ? h('li', null, h('span', { class: 'logo-tile', text: b.label })) : h('li', null, h('a', { class: 'logo-tile', href: href(b.url), text: b.label }))));
    return shp('section', { name: sec.shopify, label: sec.label, goal: sec.goal, issue: sec.issue || sec.solves, cls: 'container' }, heading(st.heading),
      h('ul', { class: 'logos' }, items), st.note ? h('p', { class: 'note', text: st.note }) : null);
  }
  function rColList(sec) {
    const st = sec.settings;
    const items = resolveLinks(st.items).map((it) => {
      const title = it.title || it.label;
      return h('li', null, h('a', { class: 'tile' + (st.compact ? ' tile--compact' : ''), href: href(it.url) },
        st.compact ? null : ph(title + ', immagine segnaposto', title, 0.55),
        h('span', { class: 'tile__title', text: title }), it.text ? h('span', { class: 'tile__text', text: it.text }) : null));
    });
    return shp('section', { name: sec.shopify, label: sec.label, goal: sec.goal, issue: sec.issue || sec.solves, cls: 'container' }, heading(st.heading),
      h('ul', { class: 'tiles' + (st.compact ? ' tiles--compact' : '') }, items), st.note ? h('p', { class: 'note', text: st.note }) : null);
  }
  function rFeatured(sec) {
    const st = sec.settings;
    const col = findCollection(st.handle);
    const list = col ? members(col).slice(0, st.count || 4) : [];
    return shp('section', { name: sec.shopify, label: sec.label, goal: sec.goal, issue: sec.issue || sec.solves, cls: 'container' }, heading(st.heading), productGrid(list),
      col ? h('p', { class: 'more' }, btn('Vedi tutta la collezione', '/collections/' + col.handle, 'btn--ghost')) : null);
  }
  function rBanner(sec) {
    const st = sec.settings;
    return shp('section', { name: sec.shopify, label: sec.label, goal: sec.goal, issue: sec.issue || sec.solves, cls: 'banner' }, ph(st.image + ', immagine segnaposto', st.image, 0.3, 'banner__img', true),
      h('div', { class: 'banner__text' }, h('h2', { text: st.heading }), st.text ? h('p', { text: st.text }) : null, btn(st.cta, st.url)));
  }
  function rImgText(sec) {
    const st = sec.settings;
    return shp('section', { name: sec.shopify, label: sec.label, goal: sec.goal, issue: sec.issue || sec.solves, cls: 'container' },
      h('div', { class: 'iwt iwt--' + (st.side || 'left') }, ph(st.image + ', immagine segnaposto', st.image, 0.7, 'iwt__img'),
        h('div', { class: 'iwt__text' }, h('h2', { text: st.heading }), h('p', { text: st.text }), btn(st.cta, st.url))));
  }
  function rBlog(sec) {
    const st = sec.settings;
    const blog = S.blogs[st.blog];
    const arts = blog.articles.slice(0, st.count || 3);
    return shp('section', { name: sec.shopify, label: sec.label, goal: sec.goal, issue: sec.issue || sec.solves, cls: 'container' }, heading(st.heading),
      h('div', { class: 'grid grid--blog' }, arts.map((a) => articleCard(a))), h('p', { class: 'more' }, btn('Vedi tutti', '/blogs/' + st.blog, 'btn--ghost')));
  }
  function articleCard(a) {
    return h('article', { class: 'card card--article' }, ph('Immagine segnaposto articolo', 'Articolo', 0.55), h('div', { class: 'card__body' },
      h('p', { class: 'card__vendor', text: a.date }), h('h3', { class: 'card__title', text: a.title }), h('p', { class: 'card__meta', text: a.excerpt })));
  }
  function rSignup(sec) {
    const st = sec.settings;
    return shp('section', { name: sec.shopify, label: sec.label, goal: sec.goal, issue: sec.issue || sec.solves, cls: 'signup' }, h('div', { class: 'container signup__row' }, h('div', null, h('h2', { text: st.heading }), h('p', { text: st.text })),
      h('form', { class: 'inline-form', onsubmit: (e) => { e.preventDefault(); toast('Anteprima: nessun dato inviato.'); } }, h('label', { class: 'sr-only', for: 'nl-home', text: 'Indirizzo email' }), h('input', { id: 'nl-home', type: 'email', required: true, placeholder: 'Email' }), h('button', { class: 'btn', type: 'submit', text: 'Subscribe' }))));
  }
  const HOME = { 'slideshow': rSlideshow, 'multicolumn': rMulti, 'logo-list': rLogos, 'collection-list': rColList, 'featured-collection': rFeatured, 'image-banner': rBanner, 'image-with-text': rImgText, 'featured-blog': rBlog, 'email-signup-banner': rSignup };

  function renderHome(main) {
    main.setAttribute('data-shopify', 'templates/index.json');
    main.setAttribute('data-label', 'Template home');
    main.setAttribute('data-kind', 'template');
    main.setAttribute('data-goal', isCur() ? 'Home attuale ricostruita dal CONTESTO: 9 blocchi.' : 'Home proposta: sezioni modulari riordinabili da Personalizza tema.');
    (isCur() ? S.current.home : S.proposed.home).forEach((s) => main.appendChild(HOME[s.type](s)));
  }

  /* ---------- Collezione ---------- */
  function facetValues(p, src) {
    if (src === 'vendor') return [p.vendor];
    if (src === 'type') return [p.type];
    if (src === 'category') return [catTitle(p)];
    if (src.indexOf('attr:') === 0) {
      const v = p.attrs[src.slice(5)];
      if (v == null) return [];
      return Array.isArray(v) ? v.map(String) : [String(v)];
    }
    return [];
  }

  function renderCollection(main, col) {
    main.setAttribute('data-shopify', 'templates/collection.json');
    main.setAttribute('data-label', 'Template collezione');
    main.setAttribute('data-kind', 'template');
    main.setAttribute('data-goal', 'Banner, griglia con filtri e ordinamento, testo di supporto.');
    const all = members(col);
    const defs = isCur() ? [{ label: 'Product type', source: 'type' }] : (S.filters[col.cat] || S.filters.default);
    const sel = {};
    let sort = 'featured';
    const openState = {};
    const crumbList = [{ label: T().home, url: '/' }];
    if (col.parent) crumbList.push({ label: col.parent.title, url: '/collections/' + col.parent.handle });
    crumbList.push({ label: col.title });

    main.appendChild(shp('section', { name: 'main-collection-banner', label: 'Banner collezione', goal: 'Titolo, descrizione e conteggio prodotti.', cls: 'page-head' }, h('div', { class: 'container' }, crumbs(crumbList),
      h('h1', { tabindex: '-1', id: 'page-title', text: col.title }), col.description ? h('p', { class: 'lead', text: col.description }) : null,
      h('p', { class: 'rule' }, h('strong', null, 'Collezione ' + col.type + '. '), col.rule ? 'Regola: ' + col.rule + '.' : '', ' Prodotti di esempio associati: ' + all.length + '.'))));

    if (!isCur() && col.subs) {
      main.appendChild(shp('section', { name: 'collection-list', label: 'Sottocategorie', goal: 'Link alle sottocollezioni (terzo livello del menu).', cls: 'container' }, heading('Sottocategorie'),
        h('ul', { class: 'tiles tiles--compact' }, col.subs.map((s) => h('li', null, h('a', { class: 'tile tile--compact', href: href('/collections/' + s.handle) }, h('span', { class: 'tile__title', text: s.title })))))));
    }

    const facetsBox = shp('div', { name: 'main-collection-product-grid › filtri', label: 'Filtri (Search & Discovery)', kind: 'block', goal: isCur() ? 'Un solo filtro: Product type (ipotesi: filtri generici).' : 'Filtri tecnici per categoria configurati in Search & Discovery.', cls: 'facets' });
    const chips = h('div', { class: 'chips' });
    const count = h('p', { class: 'count', role: 'status', 'aria-live': 'polite' });
    const grid = h('div', { class: 'grid' });
    const sortSel = h('select', { id: 'sort', onchange: () => { sort = sortSel.value; refresh(false); } },
      [['featured', 'In evidenza'], ['title-asc', 'Titolo, A a Z'], ['title-desc', 'Titolo, Z a A'], ['vendor', 'Marchio']].map((o) => h('option', { value: o[0], text: o[1] })));

    const passes = (p, skip) => defs.every((d, i) => i === skip || !sel[i] || !sel[i].length || facetValues(p, d.source).some((v) => sel[i].indexOf(v) > -1));

    function drawFacets(focusId) {
      facetsBox.innerHTML = '';
      const wrap = h('details', { class: 'filters-wrap' }, h('summary', { text: 'Filtri' }));
      if (window.innerWidth >= 900) wrap.setAttribute('open', '');
      defs.forEach((d, i) => {
        const counts = {};
        all.filter((p) => passes(p, i)).forEach((p) => facetValues(p, d.source).forEach((v) => { counts[v] = (counts[v] || 0) + 1; }));
        (sel[i] || []).forEach((v) => { if (!(v in counts)) counts[v] = 0; });
        const vals = Object.keys(counts).sort(natural);
        if (!vals.length) return;
        const g = h('details', { class: 'facet', ontoggle: (e) => { openState[i] = e.target.open; } }, h('summary', { text: d.label }),
          h('ul', null, vals.map((v) => {
            const id = 'f' + i + '-' + slug(v);
            return h('li', null, h('label', { for: id }, h('input', { type: 'checkbox', id, checked: (sel[i] || []).indexOf(v) > -1 ? true : null, onchange: (e) => {
              sel[i] = sel[i] || [];
              if (e.target.checked) sel[i].push(v); else sel[i] = sel[i].filter((x) => x !== v);
              refresh(true, id);
            } }), ' ', v, ' ', h('span', { class: 'facet__n', text: '(' + counts[v] + ')' })));
          })));
        if (openState[i] !== false) g.setAttribute('open', '');
        wrap.appendChild(g);
      });
      facetsBox.appendChild(wrap);
      if (focusId) { const f = document.getElementById(focusId); if (f) f.focus(); }
    }
    function refresh(withFacets, focusId) {
      let list = all.filter((p) => passes(p, -1));
      if (sort === 'title-asc') list = list.slice().sort((a, b) => natural(a.title, b.title));
      if (sort === 'title-desc') list = list.slice().sort((a, b) => natural(b.title, a.title));
      if (sort === 'vendor') list = list.slice().sort((a, b) => natural(a.vendor, b.vendor));
      grid.innerHTML = '';
      if (!list.length) {
        grid.appendChild(h('div', { class: 'empty' }, h('p', { text: all.length ? 'Nessun prodotto corrisponde ai filtri.' : 'Nessun prodotto di esempio in questa collezione.' }),
          all.length ? h('button', { class: 'btn btn--small', type: 'button', onclick: () => { Object.keys(sel).forEach((k) => delete sel[k]); refresh(true); }, text: 'Azzera filtri' }) : null));
      } else list.forEach((p) => grid.appendChild(productCard(p)));
      count.textContent = list.length + (list.length === 1 ? ' prodotto' : ' prodotti');
      chips.innerHTML = '';
      defs.forEach((d, i) => (sel[i] || []).forEach((v) => chips.appendChild(h('button', { class: 'chip', type: 'button', 'aria-label': 'Rimuovi filtro ' + d.label + ': ' + v, onclick: () => { sel[i] = sel[i].filter((x) => x !== v); refresh(true); } }, d.label + ': ' + v + ' ×'))));
      if (withFacets) drawFacets(focusId);
    }
    main.appendChild(shp('section', { name: 'main-collection-product-grid', label: 'Griglia prodotti', goal: 'Griglia con filtri e ordinamento (Search & Discovery).', cls: 'container' },
      h('div', { class: 'layout' }, facetsBox, h('div', { class: 'results' }, h('div', { class: 'toolbar' }, count, h('div', { class: 'sort' }, h('label', { for: 'sort', text: 'Ordina per ' }), sortSel)), chips, grid))));
    refresh(true);

    if (!isCur() && col.kind === 'category') {
      main.appendChild(shp('section', { name: 'rich-text', label: 'Testo di supporto', goal: 'Testo SEO e guida alla scelta, con domande frequenti.', cls: 'container prose' },
        h('h2', { text: 'Come scegliere ' }), h('p', null, ex(), ' Testo di esempio: qui va una breve guida alla scelta per la categoria «' + col.title + '», scritta con ALLdata. Serve a orientare l\'utente e alle ricerche.'),
        devNote('Categoria smart con tag ' + col.match.tag + '. Testo nel campo descrizione della collezione oppure sezione Rich text nel template collection.')));
    }
  }

  /* ---------- Prodotto ---------- */
  function renderProduct(main, p) {
    main.setAttribute('data-shopify', 'templates/product.json');
    main.setAttribute('data-label', 'Template prodotto');
    main.setAttribute('data-kind', 'template');
    main.setAttribute('data-goal', 'Galleria, varianti, richiesta di quotazione, specifiche, documenti, prodotti correlati.');
    const cat = catById(p.cat);
    const sub = cat && cat.subs.find((s) => p.tags.indexOf(s.tag) > -1);
    const cr = [{ label: T().home, url: '/' }];
    if (!isCur()) { cr.push({ label: cat.title, url: '/collections/' + cat.handle }); if (sub) cr.push({ label: sub.title, url: '/collections/' + sub.handle }); }
    cr.push({ label: p.title });
    const views = ['Vista frontale', 'Vista posteriore', 'Dettaglio connettori'];
    const main_img = h('div', { class: 'gallery__main' });
    const thumbs = h('div', { class: 'gallery__thumbs' });
    let cur = 0;
    const drawImg = () => { main_img.innerHTML = ''; main_img.appendChild(ph(p.type + ' ' + p.vendor + ' ' + p.code + ', ' + views[cur].toLowerCase() + ' (segnaposto)', p.code + ' ' + views[cur], 0.75)); thumbs.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', String(i === cur))); };
    views.forEach((v, i) => thumbs.appendChild(h('button', { type: 'button', class: 'thumb', 'aria-label': 'Mostra ' + v.toLowerCase(), 'aria-pressed': String(i === 0), onclick: () => { cur = i; drawImg(); } }, ph('', v, 0.75))));
    drawImg();

    const chosen = {};
    p.options.forEach((o) => { chosen[o.name] = o.values[0]; });
    const sku = h('span', { class: 'sku' });
    const drawSku = () => { sku.textContent = p.code + '-' + Object.keys(chosen).map((k) => chosen[k].charAt(0).toUpperCase() + chosen[k].replace(/[^0-9]/g, '')).join(''); };
    const fieldsets = p.options.map((o, oi) => h('fieldset', { class: 'variant' }, h('legend', { text: o.name }),
      o.values.map((v, vi) => { const id = 'opt' + oi + '-' + vi; return h('label', { class: 'pill', for: id }, h('input', { type: 'radio', name: 'opt' + oi, id, checked: vi === 0 ? true : null, onchange: () => { chosen[o.name] = v; drawSku(); } }), h('span', { text: v })); })));
    drawSku();
    const qty = h('input', { id: 'qty', type: 'number', min: '1', value: '1', inputmode: 'numeric' });
    const bh = brandHandle(p.vendor);

    const info = h('div', { class: 'pinfo' },
      shp('div', { name: 'main-product › titolo e marchio', label: 'Blocchi vendor, titolo, modello', kind: 'block', goal: 'Marchio (link alla collezione), titolo, codice.' },
        bh && !isCur() ? h('p', { class: 'card__vendor' }, h('a', { href: href('/collections/' + bh), text: p.vendor })) : h('p', { class: 'card__vendor', text: p.vendor }),
        h('h1', { id: 'page-title', tabindex: '-1', text: p.title }), h('p', { class: 'card__meta' }, 'Modello ', h('strong', { text: p.code }), ' ', ex(), ' Codice variante ', sku)),
      shp('div', { name: 'main-product › prezzo', label: 'Blocco prezzo', kind: 'block', goal: 'Nel modello a quotazione il blocco Prezzo si rimuove e si mostra un testo.', issue: isCur() ? 'R6' : '' }, h('p', { class: 'price', text: T().price })),
      h('p', { text: p.short }),
      shp('div', { name: 'main-product › selettore varianti', label: 'Varianti', kind: 'block', goal: 'Opzioni di prodotto (configurazione). Le varianti sono di esempio.' }, fieldsets),
      shp('div', { name: 'main-product › pulsanti di acquisto', label: 'Richiesta di quotazione', kind: 'block', goal: 'Pulsante di richiesta al posto di Acquista: aggiunge alla lista richiesta (app di preventivi oppure link alla pagina preventivo).' },
        h('div', { class: 'buy' }, h('label', { for: 'qty', text: 'Quantità' }), qty,
          h('button', { class: 'btn', type: 'button', onclick: () => { addToCart(p.id, Object.assign({}, chosen), Math.max(1, parseInt(qty.value, 10) || 1)); renderHeader(); toast('Aggiunto alla lista richiesta.'); }, text: T().add }),
          h('a', { class: 'btn btn--ghost', href: href(isCur() ? '/pages/contact' : '/pages/richiedi-preventivo'), text: isCur() ? 'Contact' : 'Richiedi quotazione' }))));

    main.appendChild(shp('section', { name: 'main-product', label: 'Prodotto principale', goal: 'Galleria, informazioni, varianti, richiesta.', cls: 'container' }, crumbs(cr),
      h('div', { class: 'product' }, shp('div', { name: 'main-product › galleria', label: 'Galleria media', kind: 'block', goal: 'Immagini del prodotto.', cls: 'gallery' }, main_img, thumbs), info)));

    /* specifiche */
    const rows = [['Codice costruttore', p.code]];
    S.metafields.forEach((m) => { const v = p.attrs[m.key]; if (v != null) rows.push([m.label, Array.isArray(v) ? v.join(', ') : String(v)]); });
    const table = h('table', { class: 'specs' }, h('caption', null, 'Specifiche tecniche ', ex()), h('thead', null, h('tr', null, h('th', { scope: 'col', text: 'Caratteristica' }), h('th', { scope: 'col' }, 'Valore ', ex()))),
      h('tbody', null, rows.map((r) => h('tr', null, h('th', { scope: 'row', text: r[0] }), h('td', { text: r[1] })))));
    const docs = h('ul', { class: 'docs' }, p.docs.map((d) => h('li', null, h('button', { type: 'button', class: 'linklike', onclick: () => toast('Documento segnaposto: il download non è simulato nell\'anteprima.') }, d.label + ' (PDF) ', ex()))));
    main.appendChild(shp('section', { name: 'collapsible-content', label: 'Specifiche, documenti, assistenza', goal: 'Blocchi a comparsa: specifiche da metafield, documenti da metafield di tipo file, assistenza.', cls: 'container' },
      h('details', { class: 'acc', open: true }, h('summary', { text: 'Specifiche tecniche' }), table, devNote('Le righe derivano dai metafield del prodotto (namespace custom). Tabella con blocco Custom liquid o Rich text del tema, da verificare.')),
      h('details', { class: 'acc', open: true }, h('summary', { text: 'Documenti scaricabili' }), docs, devNote('Metafield di tipo File: scheda_tecnica, manuale_utente, dichiarazione_conformita.')),
      h('details', { class: 'acc' }, h('summary', { text: 'Assistenza e servizi' }), h('p', null, 'Assistenza tecnica, installazione, formazione e calibrazione: ', h('a', { href: href(isCur() ? '/pages/contact' : '/pages/servizi'), text: 'scopri i servizi' }), '.'))));

    const rel = P.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    main.appendChild(shp('section', { name: 'product-recommendations', label: 'Prodotti correlati', goal: 'Correlati automatici della stessa categoria.', cls: 'container' }, heading(isCur() ? 'You may also like' : 'Prodotti correlati'), productGrid(rel)));
  }

  /* ---------- Ricerca ---------- */
  function renderSearch(main, params) {
    main.setAttribute('data-shopify', 'templates/search.json');
    main.setAttribute('data-label', 'Template ricerca');
    main.setAttribute('data-kind', 'template');
    main.setAttribute('data-goal', 'Risultati con filtri di Search & Discovery.');
    const q = (params.q || '').toLowerCase();
    const ty = params.type || '';
    const res = P.filter((p) => (!ty || p.type === ty) && (!q || (p.title + ' ' + p.vendor + ' ' + p.type + ' ' + p.code + ' ' + catTitle(p)).toLowerCase().indexOf(q) > -1));
    const cols = q ? collections().filter((c) => c.title.toLowerCase().indexOf(q) > -1) : [];
    main.appendChild(shp('section', { name: 'main-search', label: 'Risultati di ricerca', goal: 'Elenco risultati.', cls: 'container' }, h('h1', { id: 'page-title', tabindex: '-1', text: 'Risultati per «' + (params.q || '') + '»' + (ty ? ' in ' + ty : '') }),
      h('p', { class: 'count', role: 'status', text: res.length + ' prodotti' }),
      cols.length ? h('p', null, 'Collezioni: ', cols.map((c, i) => [i ? ', ' : '', h('a', { href: href('/collections/' + c.handle), text: c.title })])) : null,
      res.length ? productGrid(res) : h('div', { class: 'empty' }, h('p', { text: 'Nessun risultato. Prova con un marchio o una categoria.' }), btn('Vai a tutti i prodotti', '/collections/all', 'btn--ghost'))));
  }

  /* ---------- Carrello ---------- */
  function renderCart(main) {
    main.setAttribute('data-shopify', 'templates/cart.json');
    main.setAttribute('data-label', 'Template carrello');
    main.setAttribute('data-kind', 'template');
    main.setAttribute('data-goal', isCur() ? 'Carrello standard.' : 'Il carrello funziona da lista richiesta di quotazione.');
    const holder = shp('section', { name: 'main-cart-items', label: 'Righe del carrello', goal: 'Elenco righe: prodotto, opzioni, quantità.', cls: 'container' });
    function draw() {
      holder.innerHTML = '';
      holder.appendChild(h('h1', { id: 'page-title', tabindex: '-1', text: T().cartTitle }));
      if (!state.cart.length) { holder.appendChild(h('div', { class: 'empty' }, h('p', { text: isCur() ? 'Your cart is empty.' : 'La lista è vuota.' }), btn(isCur() ? 'Continue shopping' : 'Sfoglia i prodotti', '/collections/all'))); return; }
      state.cart.forEach((l) => {
        const p = P.find((x) => x.id === l.pid);
        const q = h('input', { type: 'number', min: '1', value: String(l.qty), id: 'q-' + l.key.replace(/[^a-z0-9]/gi, ''), 'aria-label': 'Quantità di ' + p.title, onchange: (e) => { l.qty = Math.max(1, parseInt(e.target.value, 10) || 1); saveCart(); draw(); } });
        holder.appendChild(h('div', { class: 'line' }, ph('', p.code, 0.75, 'line__img'), h('div', { class: 'line__info' }, h('a', { href: href('/products/' + p.handle), text: p.title }), h('p', { class: 'card__meta' }, p.vendor + ' · ' + p.code + ' ', ex()), h('p', { class: 'card__meta', text: Object.keys(l.opts).map((k) => k + ': ' + l.opts[k]).join(', ') })),
          q, h('p', { class: 'line__price', text: T().price }), h('button', { class: 'btn btn--small btn--ghost', type: 'button', onclick: () => { state.cart = state.cart.filter((x) => x !== l); saveCart(); draw(); }, 'aria-label': 'Rimuovi ' + p.title, text: 'Rimuovi' })));
      });
      holder.appendChild(shp('div', { name: 'main-cart-footer', label: 'Totale e pulsante', kind: 'block', goal: isCur() ? 'Totale e checkout.' : 'Invece del checkout: invio della richiesta di quotazione.', cls: 'cart-foot' },
        h('p', { class: 'total' }, isCur() ? 'Estimated total: ' : 'Totale: ', h('strong', { text: isCur() ? 'not shown' : 'su quotazione' })),
        isCur() ? h('button', { class: 'btn', type: 'button', onclick: () => toast('Anteprima: il checkout non è simulato.'), text: 'Check out' }) : btn('Invia richiesta di quotazione', '/pages/richiedi-preventivo')));
    }
    draw();
    main.appendChild(holder);
  }

  /* ---------- Pagine ---------- */
  function pageHead(title, intro, crumbList) {
    return shp('section', { name: 'main-page', label: 'Titolo pagina', goal: 'Titolo e introduzione della pagina.', cls: 'page-head' }, h('div', { class: 'container' }, crumbs(crumbList || [{ label: T().home, url: '/' }, { label: title }]), h('h1', { id: 'page-title', tabindex: '-1', text: title }), intro ? h('p', { class: 'lead', text: intro }) : null));
  }
  const exNote = () => h('p', { class: 'note note--ex' }, ex(), ' Testi di esempio da concordare e riscrivere con ALLdata. Dati marcati «da verificare» non sono noti.');

  function renderPageContent(main, pg) {
    main.setAttribute('data-shopify', 'templates/' + pg.template + '.json');
    main.setAttribute('data-label', 'Template ' + pg.template);
    main.setAttribute('data-kind', 'template');
    main.setAttribute('data-goal', 'Template di pagina: ' + pg.template + '.');
    main.appendChild(pageHead(pg.title, pg.intro));
    const L = pg.layout;
    if (L === 'servizi') {
      main.appendChild(shp('section', { name: 'rich-text', label: 'Indice servizi', goal: 'Link alle cinque ancore della pagina.', cls: 'container' }, exNote(), h('ul', { class: 'anchors' }, pg.sections.map((s) => h('li', null, h('a', { href: href('/pages/servizi#' + s.id), text: s.title })))),
        devNote('Una sola pagina con cinque sezioni. Le voci del menu Servizi sono link a /pages/servizi#assistenza, #integrazione ecc. (URL personalizzati nel menu).')));
      pg.sections.forEach((s, i) => main.appendChild(shp('section', { name: 'image-with-text', label: s.title, goal: 'Sezione ancorata «' + s.id + '»: a chi serve, cosa include, come richiederlo.', cls: 'container anchor', id: s.id },
        h('div', { class: 'iwt iwt--' + (i % 2 ? 'right' : 'left') }, ph(s.title + ', immagine segnaposto', s.title, 0.7, 'iwt__img'), h('div', { class: 'iwt__text' }, h('h2', { text: s.title }), h('p', { text: s.text }), h('ul', null, s.bullets.map((b) => h('li', { text: b }))), btn('Richiedi informazioni', '/pages/richiedi-preventivo'))))));
    } else if (L === 'settori') {
      main.appendChild(shp('section', { name: 'rich-text', label: 'Introduzione', goal: 'Testo introduttivo.', cls: 'container' }, exNote()));
      pg.sections.forEach((s) => {
        const col = findCollection(s.collection);
        main.appendChild(shp('section', { name: 'featured-collection', label: s.title, goal: 'Sezione ancorata «' + s.id + '» con collegamento alla collezione di settore.', cls: 'container anchor', id: s.id },
          h('h2', { text: s.title }), h('p', { text: s.text }), col ? h('p', null, btn('Prodotti per ' + s.title + ' (' + members(col).length + ' di esempio)', '/collections/' + col.handle, 'btn--ghost')) : null));
      });
    } else if (L === 'qualita') {
      main.appendChild(shp('section', { name: 'rich-text', label: 'Politica qualità', goal: 'Politica qualità come testo indicizzabile. Il PDF diventa un allegato scaricabile.', cls: 'container prose' }, exNote(),
        h('h2', { text: 'Politica qualità' }), h('p', { text: 'Testo di esempio: qui va la sintesi della politica qualità di ALLdata, attiva dal 1980 nella fornitura di strumentazione per elettronica e ingegneria.' }),
        h('p', null, h('button', { type: 'button', class: 'btn btn--ghost', onclick: () => toast('Documento segnaposto: il PDF reale è da verificare.') }, 'Scarica la politica qualità (PDF, file reale da verificare)')),
        devNote('Pagina con template dedicato. Il PDF resta nella libreria file e viene collegato dal testo. Il menu Azienda punta a questa pagina e non al PDF.')));
      main.appendChild(shp('section', { name: 'multicolumn', label: 'Certificazioni', goal: 'Elenco certificazioni con estremi da verificare.', cls: 'container' }, heading('Certificazioni'),
        h('div', { class: 'cols' }, [1, 2, 3].map((n) => h('div', { class: 'col col--static' }, h('h3', null, 'Certificazione ' + n + ' ', ex()), h('p', { text: 'Ente, norma e numero: da verificare.' }))))));
    } else if (L === 'chisiamo') {
      main.appendChild(shp('section', { name: 'image-with-text', label: 'Chi siamo', goal: 'Storia e posizionamento.', cls: 'container' }, exNote(),
        h('div', { class: 'iwt iwt--left' }, ph('Sede, immagine segnaposto', 'Sede', 0.7, 'iwt__img'), h('div', { class: 'iwt__text' }, h('h2', { text: 'High Tech Solutions for Electronics & Engineering since 1980' }),
          h('p', { text: 'Oltre 45 anni di esperienza, consulenza ingegneristica specializzata, supporto tecnico, installazione, formazione e servizi industriali personalizzati.' }),
          h('p', { text: S.shop.address })))));
      main.appendChild(rMulti({ shopify: 'multicolumn', label: 'Percorsi', goal: 'Collegamenti a servizi, qualità e settori.', settings: { columns: [{ title: 'Servizi', text: 'Assistenza, integrazione, formazione.', url: '/pages/servizi' }, { title: 'Qualità e certificazioni', text: 'Politica qualità.', url: '/pages/qualita-e-certificazioni' }, { title: 'Settori', text: 'Difesa, Aerospazio, Energia, Ricerca.', url: '/pages/settori' }] } }));
    } else if (L === 'contatti') {
      main.appendChild(rMulti({ shopify: 'multicolumn', label: 'Recapiti', goal: 'Indirizzo, telefono, email.', settings: { columns: [{ title: 'Indirizzo', text: S.shop.address }, { title: 'Telefono', text: S.shop.phone, url: 'tel:+390266015566' }, { title: 'Email', text: S.shop.email, url: 'mailto:' + S.shop.email }] } }));
      main.appendChild(shp('section', { name: 'contact-form', label: 'Modulo di contatto', goal: 'Modulo standard: nome, email, telefono, messaggio.', cls: 'container' }, heading('Scrivici'), contactForm(false),
        devNote('Sezione Contact form del tema. Orari di apertura: da verificare.')));
    } else if (L === 'preventivo') {
      main.appendChild(shp('section', { name: 'contact-form', label: 'Modulo di preventivo', goal: 'Modulo di richiesta di quotazione con riepilogo della lista richiesta.', cls: 'container' }, contactForm(true),
        devNote('Opzione A: sezione Contact form nativa. Opzione B: app Shopify Forms con campi personalizzati. Opzione C: app di preventivi dall\'App Store. Dettagli in architettura.md, sezione 10.')));
    } else if (L === 'marchi') {
      main.appendChild(rColList({ shopify: 'collection-list', label: 'Elenco marchi', goal: 'Un riquadro per ciascun marchio, con link alla collezione.', settings: { items: '@brands', compact: true, note: 'Altri circa 20 marchi della fascia partner: da verificare.' } }));
    }
  }

  function contactForm(quote) {
    const lines = state.cart.map((l) => { const p = P.find((x) => x.id === l.pid); return l.qty + ' x ' + p.title + ' (' + p.code + ')'; }).join('\n');
    const done = h('div', { class: 'note', role: 'status', hidden: true });
    const field = (id, label, input) => h('div', { class: 'field' }, h('label', { for: id, text: label }), input);
    const f = h('form', { class: 'form', onsubmit: (e) => {
      e.preventDefault();
      done.hidden = false;
      done.textContent = 'Anteprima: nessun dato è stato inviato. In Shopify la richiesta arriva via email a ' + S.shop.email + '.';
      done.focus();
    } },
      field('f-name', 'Nome e cognome', h('input', { id: 'f-name', required: true, autocomplete: 'name' })),
      quote ? field('f-company', 'Azienda', h('input', { id: 'f-company', autocomplete: 'organization' })) : null,
      field('f-email', 'Email', h('input', { id: 'f-email', type: 'email', required: true, autocomplete: 'email' })),
      field('f-phone', 'Telefono', h('input', { id: 'f-phone', type: 'tel', autocomplete: 'tel' })),
      quote ? field('f-sector', 'Settore', h('select', { id: 'f-sector' }, ['', 'Difesa', 'Aerospazio', 'Energia', 'Ricerca', 'Altro'].map((x) => h('option', { value: x, text: x || 'Seleziona' })))) : null,
      quote ? field('f-items', 'Prodotti di interesse', h('textarea', { id: 'f-items', rows: '4' }, lines)) : null,
      field('f-msg', quote ? 'Note e requisiti tecnici' : 'Messaggio', h('textarea', { id: 'f-msg', rows: '5', required: quote ? null : true })),
      h('div', { class: 'field field--check' }, h('input', { id: 'f-priv', type: 'checkbox', required: true }), h('label', { for: 'f-priv', text: 'Ho letto l\'informativa privacy' })),
      h('button', { class: 'btn', type: 'submit', text: quote ? 'Invia richiesta' : 'Invia messaggio' }));
    done.setAttribute('tabindex', '-1');
    return h('div', { class: 'form-wrap' }, f, done);
  }

  function renderBlog(main, handle) {
    const b = S.blogs[handle];
    main.setAttribute('data-shopify', 'templates/blog.json');
    main.setAttribute('data-label', 'Template blog');
    main.setAttribute('data-kind', 'template');
    main.setAttribute('data-goal', 'Elenco articoli.');
    const title = isCur() ? b.title : b.titleProposed;
    main.appendChild(shp('section', { name: 'main-blog', label: 'Elenco articoli', goal: 'Articoli del blog. Handle del blog: da verificare.', cls: 'container', issue: isCur() && handle === 'news-events' ? 'R9' : '' }, crumbs([{ label: T().home, url: '/' }, { label: title }]), h('h1', { id: 'page-title', tabindex: '-1', text: title }),
      h('p', { class: 'note', text: b.note }), h('div', { class: 'grid grid--blog' }, b.articles.map(articleCard))));
  }

  function renderNotice(main, title, text, kind) {
    main.setAttribute('data-shopify', 'templates/404.json');
    main.setAttribute('data-label', 'Template 404');
    main.setAttribute('data-kind', 'template');
    main.setAttribute('data-goal', 'Pagina non trovata o destinazione non valida.');
    main.appendChild(shp('section', { name: '404', label: 'Avviso', goal: 'Pagina di avviso.', cls: 'container notice notice--' + (kind || 'info') }, h('h1', { id: 'page-title', tabindex: '-1', text: title }), h('p', { text }), btn('Torna alla home', '/')));
  }

  /* ---------- Riepilogo struttura ---------- */
  function renderSummary(main) {
    main.setAttribute('data-shopify', 'anteprima › riepilogo');
    main.setAttribute('data-label', 'Non è un template Shopify');
    main.setAttribute('data-kind', 'template');
    main.setAttribute('data-goal', 'Pagina di servizio dell\'anteprima: riepiloga menu, home e collezioni della struttura scelta.');
    const menu = isCur() ? S.current.menu : S.proposed.menu;
    const tree = (items) => h('ul', { class: 'tree' }, items.map((it) => { const kids = it.children ? resolveLinks(it.children) : null; return h('li', null, h('a', { href: href(it.url), text: it.label }), it.issue ? h('span', { class: 'flag', text: ' ' + it.issue }) : null, kids ? tree(kids) : null); }));
    const home = isCur() ? S.current.home : S.proposed.home;
    const cols = collections();
    main.appendChild(h('div', { class: 'container summary' },
      h('h1', { id: 'page-title', tabindex: '-1', text: 'Riepilogo: struttura ' + (isCur() ? 'attuale' : 'proposta') }),
      h('p', { class: 'lead', text: 'Riassunto dei dati letti da data/structure.json. Cambia struttura con il selettore in alto.' }),
      h('h2', { text: 'Menu principale' }), tree(menu),
      isCur() ? null : [h('h2', { text: 'Menu utility' }), tree(S.proposed.utilityMenu), h('h2', { text: 'Menu footer' }), S.proposed.footerMenus.map((m) => [h('h3', { text: m.title + ' (' + m.handle + ')' }), tree(resolveLinks(m.items).map((x) => ({ label: x.label, url: x.url })))])],
      h('h2', { text: 'Ordine delle sezioni della home' }), h('ol', null, home.map((s) => h('li', null, h('code', { text: s.shopify }), ' ' + s.label + '. ' + s.goal + (s.solves || s.issue ? ' (' + (s.solves || s.issue) + ')' : '')))),
      h('h2', { text: 'Collezioni' }),
      h('div', { class: 'table-wrap' }, h('table', { class: 'specs' }, h('thead', null, h('tr', null, ['Titolo', 'Handle', 'Tipo', 'Regola'].map((x) => h('th', { scope: 'col', text: x })))),
        h('tbody', null, cols.map((c) => h('tr', null, h('th', { scope: 'row' }, h('a', { href: href('/collections/' + c.handle), text: c.title })), h('td', null, h('code', { text: c.handle })), h('td', { text: c.type }), h('td', { text: c.rule || c.note || '' })))))),
      isCur() ? null : [h('h2', { text: 'Redirect 301' }), h('div', { class: 'table-wrap' }, h('table', { class: 'specs' }, h('thead', null, h('tr', null, h('th', { scope: 'col', text: 'Da' }), h('th', { scope: 'col', text: 'A' }))), h('tbody', null, S.redirects.map((r) => h('tr', null, h('td', null, h('code', { text: r.from })), h('td', null, h('code', { text: r.to }))))))) ]));
  }

  /* ---------- Router ---------- */
  function parseHash() {
    const raw = location.hash.replace(/^#/, '') || '/';
    const a = raw.split('@');
    const q = a[0].split('?');
    const params = {};
    (q[1] || '').split('&').forEach((kv) => { if (!kv) return; const x = kv.split('='); params[decodeURIComponent(x[0])] = decodeURIComponent((x[1] || '').replace(/\+/g, ' ')); });
    return { path: (q[0] || '/').replace(/\/+$/, '') || '/', params, anchor: a[1] || '' };
  }

  function pageByHandle(handle) {
    return Object.keys(S.pages).map((k) => S.pages[k]).find((pg) => pg.handles[state.mode] === handle) || null;
  }

  function render() {
    const r = parseHash();
    if (!isCur()) {
      const rd = S.redirects.find((x) => x.from === r.path);
      if (rd) { state.redirectNote = rd; location.replace('#' + rd.to + (r.anchor ? '@' + r.anchor : '')); return; }
    }
    state.path = r.path;
    const main = $('main');
    main.innerHTML = '';
    ['data-shopify', 'data-label', 'data-kind', 'data-goal'].forEach((a) => main.removeAttribute(a));
    document.body.classList.toggle('mode-current', isCur());
    renderAnnouncement();
    renderHeader();
    renderFooter();
    if (state.redirectNote) {
      main.appendChild(h('div', { class: 'container' }, h('p', { class: 'note note--redirect', role: 'status' }, h('strong', null, 'Redirect 301 applicato: '), h('code', { text: state.redirectNote.from }), ' verso ', h('code', { text: state.redirectNote.to }), '.')));
      state.redirectNote = null;
    }
    let m;
    let title = 'ALLdata';
    const path = r.path;
    if (path === '/') { renderHome(main); title = 'Home'; }
    else if ((m = path.match(/^\/collections\/([^/]+)$/))) {
      const col = findCollection(m[1]);
      if (col) { renderCollection(main, col); title = col.title; }
      else renderNotice(main, 'Collezione non trovata', 'La collezione «' + m[1] + '» non esiste nella struttura ' + (isCur() ? 'attuale' : 'proposta') + '.', 'warn');
    } else if ((m = path.match(/^\/products\/([^/]+)$/))) {
      const p = findProduct(m[1]);
      if (p) { renderProduct(main, p); title = p.title; } else renderNotice(main, 'Prodotto non trovato', 'Il prodotto non esiste.', 'warn');
    } else if ((m = path.match(/^\/pages\/([^/]+)$/))) {
      const pg = pageByHandle(m[1]);
      if (pg) { renderPageContent(main, pg); title = pg.title; }
      else renderNotice(main, 'Pagina non presente', isCur() ? 'Questa pagina non esiste nella struttura attuale (rilevato dal CONTESTO).' : 'Pagina non trovata.', 'warn');
    } else if ((m = path.match(/^\/blogs\/([^/]+)$/))) {
      if (S.blogs[m[1]]) { renderBlog(main, m[1]); title = S.blogs[m[1]].title; } else renderNotice(main, 'Blog non trovato', 'Handle del blog da verificare.', 'warn');
    } else if (path === '/search') { renderSearch(main, r.params); title = 'Ricerca'; }
    else if (path === '/cart') { renderCart(main); title = 'Carrello'; }
    else if (path === '/account') renderNotice(main, isCur() ? 'Log in' : 'Area riservata', isCur() ? 'Pagina di accesso del sito attuale.' : 'Accesso e registrazione con Customer Accounts. L\'area riservata B2B è la fase due.', 'info');
    else if (path === '/dead-link') renderNotice(main, 'Link senza destinazione', 'Nel sito attuale la voce «Info» non ha una destinazione (rilevato). Nella proposta la voce è eliminata.', 'warn');
    else if (path === '/external/pdf-qualita') renderNotice(main, 'Apertura di un PDF', 'Nel sito attuale «Quality» apre direttamente il PDF della politica qualità, senza pagina (rilevato). Nella proposta esiste la pagina Qualità e certificazioni.', 'warn');
    else if ((m = path.match(/^\/policies\/([^/]+)$/))) renderNotice(main, 'Policy: ' + m[1], 'Le policy sono gestite da Shopify (Impostazioni, Policy). Contenuto da verificare.', 'info');
    else if (path === '/__struttura') { renderSummary(main); title = 'Riepilogo struttura'; }
    else renderNotice(main, 'Pagina non trovata', 'Percorso non riconosciuto.', 'warn');

    document.title = title + ' | ALLdata anteprima';
    if (r.anchor && document.getElementById(r.anchor)) {
      document.getElementById(r.anchor).scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const t = document.getElementById('page-title');
      if (t) t.focus({ preventScroll: true });
    }
    updatePanel();
  }

  /* ---------- Modalità struttura ---------- */
  function updatePanel() {
    const panel = $('structure-panel');
    document.body.classList.toggle('structure-on', state.structure);
    panel.hidden = !state.structure;
    $('toggle-structure').setAttribute('aria-pressed', String(state.structure));
    if (!state.structure) return;
    const els = Array.from(document.querySelectorAll('[data-shopify]')).filter((e) => e.getClientRects().length > 0);
    panel.innerHTML = '';
    panel.appendChild(h('div', { class: 'sp__head' }, h('h2', { text: 'Modalità struttura' }), h('button', { class: 'btn btn--small btn--ghost', type: 'button', onclick: () => setStructure(false), text: 'Chiudi' })));
    panel.appendChild(h('p', { class: 'sp__intro', text: 'Ogni blocco tratteggiato corrisponde a un template, una sezione o un blocco del tema Shopify. Struttura: ' + (isCur() ? 'attuale' : 'proposta') + '.' }));
    const list = h('ol', { class: 'sp__list' });
    els.forEach((el) => {
      const kind = el.getAttribute('data-kind');
      const item = h('li', null, h('button', { type: 'button', class: 'sp__item', onclick: () => { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1400); },
        onmouseenter: () => el.classList.add('flash'), onmouseleave: () => el.classList.remove('flash'), onfocus: () => el.classList.add('flash'), onblur: () => el.classList.remove('flash') },
        h('span', { class: 'sp__kind sp__kind--' + kind, text: kind === 'template' ? 'Template' : kind === 'block' ? 'Blocco' : 'Sezione' }), ' ',
        h('code', { text: el.getAttribute('data-shopify') }),
        h('span', { class: 'sp__label', text: el.getAttribute('data-label') }),
        el.getAttribute('data-goal') ? h('span', { class: 'sp__goal', text: el.getAttribute('data-goal') }) : null,
        el.getAttribute('data-issue') ? h('span', { class: 'sp__issue', text: 'Criticità: ' + el.getAttribute('data-issue') }) : null));
      list.appendChild(item);
    });
    panel.appendChild(list);
  }
  function setStructure(on) { state.structure = on; store.set('structure', on); updatePanel(); }
  function setMode(m) {
    state.mode = m;
    store.set('mode', m);
    document.querySelectorAll('input[name="mode"]').forEach((i) => { i.checked = i.value === m; });
    render();
  }

  /* ---------- Avvio ---------- */
  document.querySelectorAll('input[name="mode"]').forEach((i) => {
    i.checked = i.value === state.mode;
    i.addEventListener('change', () => setMode(i.value));
  });
  $('toggle-structure').addEventListener('click', () => setStructure(!state.structure));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { const open = document.querySelector('.nav__item.open .nav__toggle'); closeMenus(); if (open) open.focus(); updatePanel(); } });
  document.addEventListener('click', (e) => { if (!e.target.closest('.nav__item')) closeMenus(); });
  window.addEventListener('hashchange', render);
  render();
})();
