#!/usr/bin/env node
// Legge i file JSON in data/ e genera i corrispondenti file .js caricati da index.html.
// Serve perché il browser blocca fetch() sui file aperti con doppio clic (file://).
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data');
const jobs = [
  ['structure.json', 'structure.js', 'ALLDATA_STRUCTURE'],
  ['products.json', 'products.js', 'ALLDATA_PRODUCTS'],
];
for (const [src, dst, name] of jobs) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, src), 'utf8'));
  const body = '// File generato da tools/sync-data.js. Non modificare a mano: modifica ' + src + '.\nwindow.' + name + ' = ' + JSON.stringify(data) + ';\n';
  fs.writeFileSync(path.join(dir, dst), body);
  console.log('Generato data/' + dst);
}
