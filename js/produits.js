/* ================================================================
   SHEET_ID est défini dans js/app.js (chargé avant ce fichier).
   Modifiez-le là-bas — une seule ligne à changer pour tout le site.
   ================================================================ */

/* Convertit automatiquement un lien Google Drive en lien d'image direct.
   Accepte aussi les chemins locaux et les liens imgbb/autres. */
function convertirUrlImage(url) {
  if (!url) return 'images/placeholder.svg';
  // Lien de partage Google Drive → lien direct affichable
  const drive = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (drive) return `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w800`;
  return url;
}

/* Construit l'URL de chargement selon le mode choisi */
function _getUrlProduits() {
  if (typeof SHEET_ID === 'undefined' || SHEET_ID === 'LOCAL') {
    return 'data/produits.json';
  }
  return `https://opensheet.elk.sh/${SHEET_ID}/Produits`;
}

let TOUS_PRODUITS = [];

async function chargerProduits() {
  const url = _getUrlProduits();

  let data;
  try {
    const rep = await fetch(url);
    if (!rep.ok) throw new Error(`HTTP ${rep.status}`);
    data = await rep.json();
  } catch (e) {
    const source = SHEET_ID === 'LOCAL' ? 'le fichier local data/produits.json' : 'Google Sheets';
    throw new Error(`Impossible de charger les produits depuis ${source}. Vérifiez votre connexion ou la configuration.`);
  }

  /* Normalisation des données (Google Sheets envoie tout en texte) */
  data = data.map(raw => {
    const p = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k.toLowerCase(), v]));
    const prix = Number(p.prix) || 0;
    const tailles = Array.isArray(p.tailles)
      ? p.tailles
      : String(p.tailles || '').split(',').map(t => t.trim()).filter(Boolean);

    const bool = v => v === true || v === 1
      || String(v).toLowerCase() === 'true'
      || String(v).toLowerCase() === 'oui';

    return {
      ...p,
      prix,
      prix_affiche: p.prix_affiche || `${prix}€`,
      tailles,
      disponible: bool(p.disponible),
      populaire:  bool(p.populaire)
    };
  });

  TOUS_PRODUITS = data;
  return data;
}

/* Génère le HTML d'une carte produit */
function htmlCarteProduit(produit) {
  const imgSrc = convertirUrlImage(produit.image);
  const lien   = `produit.html?id=${produit.id}`;
  const badgePopulaire = produit.populaire
    ? '<span class="badge-populaire"><i class="fa-solid fa-star"></i> Populaire</span>'
    : '';

  const taillesHtml = produit.tailles
    .map(t => `<span class="badge-taille">${t}</span>`)
    .join('');

  return `
    <a href="${lien}" class="carte-produit reveal" data-id="${produit.id}" data-categorie="${produit.categorie}">
      <div class="carte-produit-image">
        ${badgePopulaire}
        <img src="${imgSrc}" alt="${produit.nom}" loading="lazy"
             onerror="this.src='images/placeholder.svg'">
      </div>
      <div class="carte-produit-body">
        <div class="carte-produit-nom">${produit.nom}</div>
        <div class="carte-produit-prix">
          <span class="carte-produit-prix-prefixe">A partir de </span>${produit.prix_affiche}
        </div>
        <div class="carte-produit-tailles">${taillesHtml}</div>
      </div>
      <div class="carte-produit-footer">
        <div class="btn-voir-details">Voir Details <span>›</span></div>
      </div>
    </a>
  `;
}

/* Affiche les produits dans un conteneur donné */
function afficherProduits(produits, conteneurId) {
  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  const disponibles = produits.filter(p => p.disponible !== false);

  if (disponibles.length === 0) {
    conteneur.innerHTML = '<p class="message-vide">Aucun produit dans cette catégorie pour le moment.</p>';
    return;
  }

  conteneur.innerHTML = disponibles.map(htmlCarteProduit).join('');
  if (typeof initScrollAnimations === 'function') initScrollAnimations();
}
