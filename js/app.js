/* ================================================================
   ⚙️  IDENTIFIANT GOOGLE SHEETS — MODIFIEZ UNIQUEMENT CETTE LIGNE
   Collez l'ID de votre Google Sheets entre les guillemets.
   Laissez 'LOCAL' pour utiliser les fichiers locaux (data/*.json).

   Exemple : const SHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms';
   ================================================================ */
const SHEET_ID = '1h5VJhbeh6xwzR_SbVJQC4MF5CxMFvluApSHL6u2xQe0';

/* ================================================================
   ⭐  LIEN DU FORMULAIRE D'AVIS — MODIFIEZ CETTE LIGNE
   Collez l'URL de votre Google Form pour les avis clients.
   Laissez '' (vide) pour masquer le bouton "Laisser un avis".

   Exemple : const FORM_AVIS_URL = 'https://forms.gle/AbCd1234';
   ================================================================ */
const FORM_AVIS_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd6HvLEFtXQBvth0vJT8z4G6PMEJgjocqF3izvRHfjg387KrA/viewform';

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
      .catch(() => { throw new Error('Impossible de charger la configuration locale.'); });

  } else {
    /* Mode Google Sheets : charge Config + Avis + garde config.json pour le fallback */
    _configPromise = Promise.all([
      fetch(`https://opensheet.elk.sh/${SHEET_ID}/Config`)
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }),
      fetch('data/config.json')
        .then(r => r.json())
        .catch(() => ({})),
      fetch(`https://opensheet.elk.sh/${SHEET_ID}/Avis`)
        .then(r => r.json())
        .catch(() => [])   /* l'onglet Avis peut être vide au départ */
    ])
    .then(([sheetsData, localData, avisData]) => {
      const ligne = sheetsData[0] || {};

      /* Normalise les avis reçus depuis Google Forms / Google Sheets */
      const avisSheets = avisData
        .map(a => ({
          nom:    String(a.nom    || a.Nom    || 'Anonyme').trim(),
          note:   Math.min(5, Math.max(1, Number(a.note  || a.Note)  || 5)),
          texte:  String(a.texte  || a.Texte  || '').trim(),
          photo:  String(a.photo  || a.Photo  || '').trim(),
          valide: String(a.valide || a.Valide || a.VALIDE || '').toUpperCase().trim()
        }))
        /* Seules les lignes où valide = "TRUE" sont affichées (modération manuelle) */
        .filter(a => a.texte && a.valide === 'TRUE');

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
            numero:         ligne.whatsapp_numero  || localData.reseaux?.whatsapp?.numero         || '',
            message_defaut: ligne.whatsapp_message || localData.reseaux?.whatsapp?.message_defaut || 'Bonjour, je veux commander un maillot !'
          },
          snapchat:  { profil: ligne.snapchat  || localData.reseaux?.snapchat?.profil  || '' },
          instagram: { profil: ligne.instagram || localData.reseaux?.instagram?.profil || '' },
          tiktok:    { profil: ligne.tiktok    || localData.reseaux?.tiktok?.profil    || '' }
        },
        /* Priorité aux avis Google Sheets ; fallback sur config.json */
        avis_clients: avisSheets.length > 0 ? avisSheets : (localData.avis_clients || []),
        couleurs:     localData.couleurs || {}
      };
      return CONFIG;
    })
    .catch(() => {
      throw new Error('Impossible de charger la configuration Google Sheets. Vérifiez votre SHEET_ID et que le Sheet est bien publié.');
    });
  }

  return _configPromise;
}

/* ================================================================
   MODAL FORMULAIRE D'AVIS
   ================================================================ */

function ouvrirModalAvis() {
  if (!FORM_AVIS_URL) return;
  const overlay = document.getElementById('modal-avis');
  const iframe  = document.getElementById('iframe-form-avis');
  if (!overlay || !iframe) return;
  /* Supprime les paramètres existants et force ?embedded=true pour l'intégration */
  const url = FORM_AVIS_URL.split('?')[0] + '?embedded=true';
  iframe.src = url;
  overlay.classList.add('ouvert');
  document.body.style.overflow = 'hidden';
}

function fermerModalAvis() {
  const overlay = document.getElementById('modal-avis');
  const iframe  = document.getElementById('iframe-form-avis');
  if (!overlay || !iframe) return;
  overlay.classList.remove('ouvert');
  iframe.src = '';
  document.body.style.overflow = '';
}

/* Fermer le modal en cliquant en dehors */
document.addEventListener('click', e => {
  if (e.target.id === 'modal-avis') fermerModalAvis();
});

/* Fermer avec Échap */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') fermerModalAvis();
});

/* ================================================================
   UTILITAIRES
   ================================================================ */

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

function etoiles(note) {
  const pleine = '<i class="fa-solid fa-star"></i>';
  const vide   = '<i class="fa-regular fa-star"></i>';
  return pleine.repeat(note) + vide.repeat(5 - note);
}

function afficherErreurGlobale(message) {
  document.querySelectorAll('.loader').forEach(el => {
    el.innerHTML = `<p class="message-vide" style="color:#e55;padding:1rem;">${message}</p>`;
  });
}

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

  /* Bouton "Laisser un avis" : visible seulement si FORM_AVIS_URL est rempli */
  const btnAvis = document.getElementById('btn-laisser-avis');
  if (btnAvis) btnAvis.style.display = FORM_AVIS_URL ? 'inline-flex' : 'none';

  /* Active le lien nav courant */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(lien => {
    if (lien.getAttribute('href') === page) lien.classList.add('active');
  });
}

function initHamburger() {
  const btn   = document.querySelector('.hamburger');
  const liens = document.querySelector('.navbar-links');
  if (!btn || !liens) return;
  btn.addEventListener('click', () => liens.classList.toggle('ouvert'));
}

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
