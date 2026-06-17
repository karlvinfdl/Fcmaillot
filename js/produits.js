/* Chargement et affichage des produits depuis produits.json */

/* OPTION GOOGLE SHEETS :
   Pour utiliser Google Sheets à la place de produits.json :
   1. Créez un Google Sheets avec les colonnes :
      id | nom | prix | prix_affiche | image | description | tailles | categorie | disponible | populaire
   2. Publiez le sheet (Fichier > Partager > Publier sur le web > Feuille entière > JSON)
   3. Récupérez l'ID de votre Google Sheet dans son URL (la longue suite de lettres/chiffres)
   4. Remplacez la ligne ci-dessous :
      const URL_PRODUITS = 'data/produits.json';
      par :
      const URL_PRODUITS = 'https://opensheet.elk.sh/VOTRE_ID_ICI/Produits';
   Note : dans Google Sheets, la colonne "tailles" doit contenir les tailles séparées par des virgules (ex: S,M,L,XL)
*/
const URL_PRODUITS = 'data/produits.json';

let TOUS_PRODUITS = [];

async function chargerProduits() {
  const rep = await fetch(URL_PRODUITS);
  let data = await rep.json();
  /* Compatibilité Google Sheets : les tailles peuvent arriver en string "S,M,L,XL" */
  data = data.map(p => ({
    ...p,
    tailles: Array.isArray(p.tailles) ? p.tailles : String(p.tailles).split(',').map(t => t.trim()),
    disponible: p.disponible === true || p.disponible === 'true' || p.disponible === 1,
    populaire: p.populaire === true || p.populaire === 'true' || p.populaire === 1
  }));
  TOUS_PRODUITS = data;
  return data;
}

/* Génère le HTML d'une carte produit */
function htmlCarteProduit(produit, lienVersDetail = true) {
  const imgSrc = produit.image || 'images/placeholder.svg';
  const lien = `produit.html?id=${produit.id}`;
  const badgePopulaire = produit.populaire
    ? '<span class="badge-populaire">⭐ Populaire</span>'
    : '';

  const taillesHtml = produit.tailles
    .map(t => `<span class="badge-taille">${t}</span>`)
    .join('');

  return `
    <div class="carte-produit" data-id="${produit.id}" data-categorie="${produit.categorie}">
      <div class="carte-produit-image">
        ${badgePopulaire}
        <img src="${imgSrc}" alt="${produit.nom}" loading="lazy"
             onerror="this.src='images/placeholder.jpg'">
      </div>
      <div class="carte-produit-body">
        <div class="carte-produit-nom">${produit.nom}</div>
        <div class="carte-produit-prix">
          <span class="carte-produit-prix-prefixe">A partir de </span>${produit.prix_affiche}
        </div>
        <div class="carte-produit-tailles">${taillesHtml}</div>
      </div>
      <div class="carte-produit-footer">
        ${lienVersDetail
          ? `<a href="${lien}" class="btn-voir-details">Voir Details <span>›</span></a>`
          : `<button class="btn-voir-details" onclick="window.location='${lien}'">Voir Details <span>›</span></button>`
        }
      </div>
    </div>
  `;
}

/* Affiche les produits dans un conteneur donné, avec filtre optionnel */
function afficherProduits(produits, conteneurId) {
  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  const disponibles = produits.filter(p => p.disponible !== false);

  if (disponibles.length === 0) {
    conteneur.innerHTML = '<p class="message-vide">Aucun produit dans cette catégorie pour le moment.</p>';
    return;
  }

  conteneur.innerHTML = disponibles.map(htmlCarteProduit).join('');
}
