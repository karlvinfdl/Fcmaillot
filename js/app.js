/* ================================================================
   ⚙️  IDENTIFIANT GOOGLE SHEETS — MODIFIEZ UNIQUEMENT CETTE LIGNE
   Collez l'ID de votre Google Sheets entre les guillemets.
   Laissez 'LOCAL' pour utiliser les fichiers locaux (data/*.json).

   Exemple : const SHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms';
   ================================================================ */
const SHEET_ID = 'LOCAL';

/* ================================================================
   NE PAS MODIFIER EN DESSOUS DE CETTE LIGNE
   ================================================================ */

let CONFIG = null;
let _configPromise = null;

function chargerConfig() {
  if (_configPromise) return _configPromise;

  if (SHEET_ID === 'LOCAL') {
    /* Mode local : charge data/config.json directement */
    _configPromise = fetch('data/config.json')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { CONFIG = data; return data; })
      .catch(e => { throw new Error('Impossible de charger la configuration locale.'); });

  } else {
    /* Mode Google Sheets : onglet "Config" + avis depuis config.json local */
    _configPromise = Promise.all([
      fetch(`https://opensheet.elk.sh/${SHEET_ID}/Config`)
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
      fetch('data/config.json')
        .then(r => r.json())
        .catch(() => ({}))  /* config.json reste optionnel en mode Sheets */
    ])
    .then(([sheetsData, localData]) => {
      /* Google Sheets renvoie un tableau — on prend la première ligne */
      const ligne = sheetsData[0] || {};

      CONFIG = {
        entreprise: {
          nom:         ligne.nom         || localData.entreprise?.nom         || 'FC Maillot',
          slogan:      ligne.slogan      || localData.entreprise?.slogan      || '',
          email:       ligne.email       || localData.entreprise?.email       || '',
          description: ligne.description || localData.entreprise?.description || ''
        },
        hero: {
          titre: ligne.hero_titre || localData.hero?.titre || '',
          texte: ligne.hero_texte || localData.hero?.texte || ''
        },
        reseaux: {
          whatsapp: {
            numero:          ligne.whatsapp_numero  || localData.reseaux?.whatsapp?.numero          || '',
            message_defaut:  ligne.whatsapp_message || localData.reseaux?.whatsapp?.message_defaut  || 'Bonjour, je veux commander un maillot !'
          },
          snapchat:  { profil: ligne.snapchat  || localData.reseaux?.snapchat?.profil  || '' },
          instagram: { profil: ligne.instagram || localData.reseaux?.instagram?.profil || '' },
          tiktok:    { profil: ligne.tiktok    || localData.reseaux?.tiktok?.profil    || '' }
        },
        /* Les avis clients restent dans config.json (ils contiennent des URLs de photos) */
        avis_clients: localData.avis_clients || [],
        couleurs:     localData.couleurs     || {}
      };
      return CONFIG;
    })
    .catch(e => {
      throw new Error('Impossible de charger la configuration Google Sheets. Vérifiez votre SHEET_ID et que le Sheet est bien publié.');
    });
  }

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

/* Génère les étoiles avec Font Awesome */
function etoiles(note) {
  const pleine = '<i class="fa-solid fa-star"></i>';
  const vide   = '<i class="fa-regular fa-star"></i>';
  return pleine.repeat(note) + vide.repeat(5 - note);
}

/* Affiche un message d'erreur dans tous les conteneurs de chargement */
function afficherErreurGlobale(message) {
  document.querySelectorAll('.loader').forEach(el => {
    el.innerHTML = `<p class="message-vide" style="color:#e55;padding:1rem;">${message}</p>`;
  });
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
  if (heroTitre && CONFIG.hero.titre) heroTitre.textContent = CONFIG.hero.titre;
  const heroTexte = document.querySelector('[data-config="hero-texte"]');
  if (heroTexte && CONFIG.hero.texte) heroTexte.textContent = CONFIG.hero.texte;

  /* Active le lien nav courant */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(lien => {
    if (lien.getAttribute('href') === page) lien.classList.add('active');
  });
}

/* Menu hamburger mobile */
function initHamburger() {
  const btn  = document.querySelector('.hamburger');
  const liens = document.querySelector('.navbar-links');
  if (!btn || !liens) return;
  btn.addEventListener('click', () => liens.classList.toggle('ouvert'));
}

/* Initialisation commune à toutes les pages */
async function initPage() {
  try {
    await chargerConfig();
    injecterConfig();
  } catch (e) {
    console.error('Erreur config :', e.message);
    afficherErreurGlobale(e.message);
  }
  initHamburger();
}

document.addEventListener('DOMContentLoaded', initPage);
