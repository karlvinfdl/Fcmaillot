const fs   = require('fs');
const path = require('path');

async function build() {
  const CleanCSS = require('clean-css');
  const { minify } = require('terser');

  /* Nettoyage du dossier dist */
  fs.rmSync('dist', { recursive: true, force: true });

  /* Création des dossiers */
  ['dist', 'dist/css', 'dist/js'].forEach(d => fs.mkdirSync(d, { recursive: true }));

  /* Copie des fichiers HTML */
  const pages = ['index.html', 'produits.html', 'produit.html', 'contact.html'];
  pages.forEach(f => {
    fs.copyFileSync(f, `dist/${f}`);
    console.log(`  📄 ${f}`);
  });

  /* Copie des dossiers statiques */
  ['images', 'data'].forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.cpSync(dir, `dist/${dir}`, { recursive: true });
      console.log(`  📁 ${dir}/`);
    }
  });

  /* Minification CSS */
  const cssIn  = fs.readFileSync('css/style.css', 'utf8');
  const cssOut = new CleanCSS({ level: 2 }).minify(cssIn);
  fs.writeFileSync('dist/css/style.css', cssOut.styles);
  const cssSave = Math.round((1 - cssOut.styles.length / cssIn.length) * 100);
  console.log(`  🎨 css/style.css  (-${cssSave}%)`);

  /* Minification JS */
  for (const file of ['app.js', 'produits.js']) {
    const jsIn  = fs.readFileSync(`js/${file}`, 'utf8');
    const jsOut = await minify(jsIn, { compress: true, mangle: true });
    fs.writeFileSync(`dist/js/${file}`, jsOut.code);
    const jsSave = Math.round((1 - jsOut.code.length / jsIn.length) * 100);
    console.log(`  ⚡ js/${file}  (-${jsSave}%)`);
  }

  console.log('\n✅  Build terminé → dist/');
}

console.log('\n🔨 Build en cours...\n');
build().catch(e => { console.error('\n❌ Erreur :', e.message); process.exit(1); });
