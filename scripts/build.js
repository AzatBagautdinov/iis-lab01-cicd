const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
fs.mkdirSync(path.join(root,'dist'),{recursive:true});
fs.cpSync(path.join(root,'src'),path.join(root,'dist/src'),{recursive:true});
console.log('Build: source copied to dist/src');
