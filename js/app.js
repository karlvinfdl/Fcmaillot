/* Configuration centrale – partagée entre toutes les pages */

let CONFIG = null;
let _configPromise = null;

/* Charge config.json une seule fois, retourne toujours la même promesse */
function chargerConfig() {
  if (_configPromise) return _configPromise;
  _configPromise = fetch('data/config.json')
    .then(r => r.json())
    .then(data => { CONFIG = data; return data; });
  return _configPromise;
}

/* Construit l'URL WhatsApp pour un produit donné */
function urlWhatsApp(nomProduit) {
  if (!CONFIG) return '#';
  const num = CONFIG.reseaux.whatsapp.numero;
  const msg = nomProduit
    ? `Bonjour, je veux commander : ${nomProduit}`
    : CONFIG.reseaux.whatsapp.message_defaut;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

function urlSnapchat() {
  if (!CONFIG) return '#';
  return `https://www.snapchat.com/add/${CONFIG.reseaux.snapchat.profil}`;
}

function urlInstagram() {
  if (!CONFIG) return '#';
  return `https://www.instagram.com/${CONFIG.reseaux.instagram.profil}`;
}

function urlTikTok() {
  if (!CONFIG) return '#';
  return `https://www.tiktok.com/${CONFIG.reseaux.tiktok.profil}`;
}

/* Génère les étoiles */
function etoiles(note) {
  return '★'.repeat(note) + '☆'.repeat(5 - note);
}

/* Injecte les données config dans les attributs data-config du DOM */
function injecterConfig() {
  document.querySelectorAll('[data-config="nom"]').forEach(el => {
    el.textContent = CONFIG.entreprise.nom;
  });
  document.querySelectorAll('[data-config="slogan"]').forEach(el => {
    el.textContent = CONFIG.entreprise.slogan;
  });
  document.querySelectorAll('[data-config="lien-whatsapp"]').forEach(el => {
    el.href = urlWhatsApp();
  });
  document.querySelectorAll('[data-config="lien-snapchat"]').forEach(el => {
    el.href = urlSnapchat();
  });
  document.querySelectorAll('[data-config="lien-instagram"]').forEach(el => {
    el.href = urlInstagram();
  });
  document.querySelectorAll('[data-config="lien-tiktok"]').forEach(el => {
    el.href = urlTikTok();
  });

  const heroTitre = document.querySelector('[data-config="hero-titre"]');
  if (heroTitre) heroTitre.textContent = CONFIG.hero.titre;
  const heroTexte = document.querySelector('[data-config="hero-texte"]');
  if (heroTexte) heroTexte.textContent = CONFIG.hero.texte;

  /* Active le lien nav courant */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(lien => {
    if (lien.getAttribute('href') === page) lien.classList.add('active');
  });
}

/* Menu hamburger mobile */
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const liens = document.querySelector('.navbar-links');
  if (!btn || !liens) return;
  btn.addEventListener('click', () => liens.classList.toggle('ouvert'));
}

/* Initialisation commune */
async function initPage() {
  try {
    await chargerConfig();
    injecterConfig();
  } catch (e) {
    console.error('Erreur chargement config.json :', e);
  }
  initHamburger();
}

document.addEventListener('DOMContentLoaded', initPage);
