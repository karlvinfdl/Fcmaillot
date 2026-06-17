# Guide Propriétaire – FC Maillot

Bienvenue ! Ce guide vous explique comment gérer votre site vous-même, sans connaissance technique.

---

## Structure du site

```
fcmaillot/
├── index.html          ← Page d'accueil
├── produits.html       ← Catalogue des maillots
├── produit.html        ← Fiche détail d'un maillot
├── contact.html        ← Page contact
├── data/
│   ├── config.json     ← Vos infos (réseaux sociaux, nom, avis clients...)
│   └── produits.json   ← Vos produits (si vous n'utilisez pas Google Sheets)
├── images/
│   ├── produits/       ← Photos des maillots
│   └── avis/           ← Photos des clients
└── js/
    └── app.js          ← ⭐ L'unique ligne à modifier pour Google Sheets
```

---

## 1. Gérer les produits via Google Sheets (recommandé)

Avec Google Sheets, vous gérez vos maillots dans un tableau en ligne, comme Excel.
Pas besoin de toucher au code — juste modifier le tableau et le site se met à jour.

### Étape 1 — Créer votre Google Sheets

1. Allez sur [sheets.google.com](https://sheets.google.com) et créez un nouveau fichier
2. Renommez-le (ex : "FC Maillot – Produits")
3. En bas, vous voyez un onglet nommé "Feuille 1" — double-cliquez dessus et renommez-le exactement :
   **`Produits`** (avec un grand P, sans accent, sans espace)
4. Dans la première ligne, écrivez ces en-têtes **exactement** (une par colonne) :

```
A              B     C     D              E                          F            G          H           I           J
id             nom   prix  prix_affiche   image                      description  tailles    categorie   disponible  populaire
paris-24       ...   35    35€            images/produits/paris.jpg  ...          S,M,L,XL   clubs-fr    TRUE        TRUE
barca-24       ...   35    35€            images/produits/barca.jpg  ...          S,M,L,XL   clubs-esp   TRUE        FALSE
```

**Détail de chaque colonne :**

| Colonne | Ce qu'il faut écrire | Exemple |
|---|---|---|
| `id` | Identifiant unique sans espaces | `paris-24` |
| `nom` | Nom du maillot | `Maillot Paris 24` |
| `prix` | Prix en chiffre seul | `35` |
| `prix_affiche` | Prix tel qu'affiché | `35€` |
| `image` | Chemin de la photo | `images/produits/paris-24.jpg` |
| `description` | Texte de description | `Maillot de qualité...` |
| `tailles` | Tailles séparées par des virgules | `S,M,L,XL` |
| `categorie` | Catégorie (voir liste ci-dessous) | `clubs-francais` |
| `disponible` | `TRUE` pour visible, `FALSE` pour caché | `TRUE` |
| `populaire` | `TRUE` pour afficher sur l'accueil | `TRUE` |

**Catégories disponibles :**
- `clubs-francais`
- `clubs-espagnols`
- `clubs-anglais`
- `editions-speciales`
- `selections`

---

### Étape 2 — Créer l'onglet Config (optionnel)

Si vous voulez aussi gérer vos infos (WhatsApp, Snapchat...) depuis Google Sheets :

1. Cliquez sur le **+** en bas pour ajouter un onglet
2. Renommez-le exactement : **`Config`**
3. Première ligne = les en-têtes, deuxième ligne = vos valeurs :

```
nom          slogan                            email                  hero_titre                          hero_texte                              whatsapp_numero   whatsapp_message              snapchat    instagram   tiktok
FC Maillot   Maillots de foot à prix imbatt.   contact@fcmaillot.fr   MAILLOTS DE FOOT À PRIX IMBATTABLES  Qualité Pro • Livraison Rapide          33612345678       Bonjour je veux commander !   fcmaillot   fcmaillot   @fcmaillot
```

**Détail de chaque colonne :**

| Colonne | Description |
|---|---|
| `nom` | Nom de votre boutique |
| `slogan` | Phrase d'accroche |
| `email` | Votre email de contact |
| `hero_titre` | Grand titre sur la page d'accueil |
| `hero_texte` | Sous-titre de la page d'accueil |
| `whatsapp_numero` | Numéro sans + ni espaces (ex: `33612345678`) |
| `whatsapp_message` | Message pré-rempli WhatsApp |
| `snapchat` | Votre pseudo Snapchat |
| `instagram` | Votre pseudo Instagram |
| `tiktok` | Votre pseudo TikTok (avec @) |

---

### Étape 3 — Publier votre Google Sheets

Pour que le site puisse lire votre tableau, il doit être accessible publiquement :

1. Dans Google Sheets, cliquez sur **Fichier** (en haut à gauche)
2. Choisissez **Partager** → **Publier sur le web**
3. Dans la fenêtre qui s'ouvre :
   - Sélectionnez **"Document entier"**
   - Format : **"Page Web"** (ou tout autre format, ça n'a pas d'importance)
4. Cliquez sur **"Publier"** puis confirmez avec **"OK"**
5. Fermez cette fenêtre

---

### Étape 4 — Récupérer votre Sheet ID

Regardez l'URL de votre Google Sheets dans la barre du navigateur.
Elle ressemble à ceci :

```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit
                                       ↑_________________________________________↑
                                       C'est votre SHEET_ID — copiez cette partie
```

Copiez la longue suite de lettres et chiffres entre `/d/` et `/edit`.

---

### Étape 5 — Coller l'ID dans le code

1. Ouvrez le fichier `js/app.js` avec le Bloc-Notes
2. Tout en haut du fichier, trouvez cette ligne :

```javascript
const SHEET_ID = 'LOCAL';
```

3. Remplacez `LOCAL` par votre ID (gardez les guillemets) :

```javascript
const SHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms';
```

4. Sauvegardez le fichier (Ctrl+S)
5. Publiez sur GitHub (voir section 7 ci-dessous)

C'est tout ! Le site chargera désormais les produits depuis votre Google Sheets.

---

### Ajouter / modifier / supprimer un produit

- **Ajouter** → Ajoutez une nouvelle ligne dans l'onglet "Produits" de votre Google Sheets
- **Modifier** → Changez la valeur dans la cellule correspondante
- **Supprimer** → Supprimez la ligne entière
- **Cacher sans supprimer** → Mettez `FALSE` dans la colonne `disponible`

Les changements apparaissent sur le site dans les **2-5 minutes** (délai du cache Google).

---

## 2. Ajouter une photo de maillot sans passer par GitHub

Si vous gérez vos produits depuis Google Sheets et que vous voulez ajouter une photo
sans demander à votre développeur, suivez ces étapes avec Imgur (gratuit, sans compte).

### Étape 1 : Uploader la photo sur Imgur

1. Allez sur https://imgur.com/upload
2. Glissez votre photo de maillot dans la zone d'upload (formats JPG ou PNG, idéalement carrée)
3. Attendez la fin de l'upload

### Étape 2 : Récupérer le lien direct de l'image

1. Une fois l'image uploadée, cliquez-droit sur l'image affichée
2. Choisissez "Copier l'adresse de l'image" (ou "Copy image address")
3. Le lien doit ressembler à : https://i.imgur.com/AbCd123.png
   (il doit se terminer par .png ou .jpg, sinon ce n'est pas le bon lien)

### Étape 3 : Coller le lien dans Google Sheets

1. Ouvrez votre Google Sheets, onglet "Produits"
2. Dans la colonne "image" de la ligne correspondant à votre maillot, collez le lien copié
3. Exemple : au lieu de `images/produits/paris24.png`, mettez
   `https://i.imgur.com/AbCd123.png`

### Étape 4 : Vérifier que ça fonctionne

Le site se mettra à jour automatiquement (quelques minutes de délai possible).
Si l'image ne s'affiche pas :
- Vérifiez que le lien se termine bien par `.jpg` ou `.png`
- Vérifiez qu'il n'y a pas d'espace avant ou après le lien dans la cellule
- Re-testez le lien en le collant directement dans un nouvel onglet de votre navigateur :
  si l'image s'affiche seule sur la page, le lien est correct

### À savoir

- Une fois uploadée sur Imgur, l'image reste en ligne sans limite de temps connue,
  mais Imgur peut supprimer les images inactives après une longue période sans vue.
  Pour un usage commercial sérieux, héberger les images directement dans le dossier
  `images/produits/` du site (via GitHub) reste la solution la plus fiable à long terme.
- Vous pouvez mélanger les deux méthodes : certaines photos dans `images/produits/`,
  d'autres en lien Imgur, selon ce qui vous est le plus simple au moment de l'ajout.

---

## 3. Gérer les produits via le fichier JSON (méthode simple)

Si vous ne voulez pas utiliser Google Sheets, ouvrez `data/produits.json` avec le Bloc-Notes.

**Ajouter un produit** — ajoutez ce bloc avant le `]` final :

```json
,
{
  "id": "arsenal-24",
  "nom": "Maillot Arsenal 24",
  "prix": 35,
  "prix_affiche": "35€",
  "image": "images/produits/arsenal-24.jpg",
  "images_galerie": ["images/produits/arsenal-24.jpg"],
  "description": "Décrivez votre maillot ici.",
  "tailles": ["S", "M", "L", "XL"],
  "categorie": "clubs-anglais",
  "disponible": true,
  "populaire": false
}
```

> L'`id` doit être unique et sans espaces (utilisez des tirets).

**Rendre un produit indisponible :** mettez `"disponible": false`

**Mettre en populaire (affiché en accueil) :** mettez `"populaire": true`

---

## 4. Changer vos informations (sans Google Sheets)

Ouvrez `data/config.json` avec le Bloc-Notes.

**Numéro WhatsApp** (sans +, sans espaces) :
```json
"whatsapp": { "numero": "33612345678" }
```

**Profil Snapchat / Instagram / TikTok** :
```json
"snapchat":  { "profil": "votre-pseudo" },
"instagram": { "profil": "votre-pseudo" },
"tiktok":    { "profil": "@votre-pseudo" }
```

---

## 5. Ajouter une photo de maillot (via GitHub)

1. Renommez votre photo en minuscules sans espaces : `arsenal-24.jpg`
2. Copiez-la dans `images/produits/`
3. Dans votre Google Sheets (ou `produits.json`), mettez : `images/produits/arsenal-24.jpg`

> Formats acceptés : `.jpg`, `.jpeg`, `.png`, `.webp`
> Taille recommandée : 600×600 pixels minimum, format carré

---

## 6. Permettre aux clients de laisser un avis (Google Forms)

Avec Google Forms, vos clients peuvent laisser un avis directement depuis votre site.
Le bouton "Laisser un avis" s'ouvre en fenêtre sans quitter la page.

### Étape 1 — Créer le formulaire Google Forms

1. Allez sur [forms.google.com](https://forms.google.com) et créez un nouveau formulaire
2. Donnez-lui un titre : "Avis clients – FC Maillot"
3. Ajoutez exactement **3 questions** avec ces libellés exacts :

| Libellé de la question | Type de question |
|---|---|
| `nom` | Réponse courte |
| `note` | Échelle linéaire (minimum 1, maximum 5) |
| `texte` | Réponse longue |

> Le libellé est ce que vous tapez dans le champ "Question" dans Google Forms.
> Il doit être écrit exactement comme indiqué (minuscules, sans accent).

### Étape 2 — Lier le formulaire à votre Google Sheets

1. Dans Google Forms, cliquez sur l'onglet **"Réponses"** (en haut)
2. Cliquez sur l'icône verte **"Lier à Sheets"** (icône tableur)
3. Choisissez **"Sélectionner une feuille de calcul existante"**
4. Choisissez votre Google Sheets FC Maillot
5. Google va créer automatiquement un onglet **"Réponses au formulaire 1"**
6. Renommez cet onglet en **`Avis`** (double-cliquez sur l'onglet en bas)

Les colonnes créées seront : `Horodateur | nom | note | texte`
Le site lira automatiquement cet onglet.

### Étape 3 — Récupérer le lien du formulaire

1. Dans Google Forms, cliquez sur **"Envoyer"** (bouton en haut à droite)
2. Cliquez sur l'icône **lien** (chaîne)
3. Cochez **"Raccourcir l'URL"**
4. Copiez le lien (ex : `https://forms.gle/AbCd1234`)

### Étape 4 — Activer le bouton sur le site

1. Ouvrez `js/app.js` avec le Bloc-Notes
2. Trouvez cette ligne (vers le début du fichier) :

```javascript
const FORM_AVIS_URL = '';
```

3. Collez votre lien entre les guillemets :

```javascript
const FORM_AVIS_URL = 'https://forms.gle/AbCd1234';
```

4. Sauvegardez et publiez sur GitHub (voir section 7)

Le bouton **"Laisser un avis"** apparaîtra alors automatiquement sur la page d'accueil.

### Modérer les avis

- Ouvrez l'onglet **"Avis"** dans votre Google Sheets
- Pour **supprimer un avis** : sélectionnez la ligne et supprimez-la
- Pour **masquer un avis** sans le supprimer : effacez juste le contenu de la colonne `texte`
- Les changements s'appliquent sur le site en quelques minutes

### Avis manuels (sans Google Forms)

Si vous voulez ajouter un avis manuellement (ex : un client vous a écrit sur WhatsApp) :
- Ouvrez l'onglet **"Avis"** dans Google Sheets
- Ajoutez une ligne : laissez `Horodateur` vide, remplissez `nom`, `note` (1-5), `texte`

---

### Avis sans Google Sheets (mode local)

Si vous n'utilisez pas Google Sheets, les avis restent dans `data/config.json`.
Trouvez la section `avis_clients` et ajoutez un bloc :

```json
{
  "nom": "Thomas R.",
  "texte": "Très satisfait, livraison rapide !",
  "photo": "images/avis/thomas.jpg",
  "note": 5
}
```

Si vous n'avez pas de photo client, mettez `"photo": ""`.

---

## 7. Publier les changements sur GitHub Pages

### Publier une mise à jour

1. Ouvrez **GitHub Desktop**
2. Vous voyez la liste des fichiers modifiés à gauche
3. Écrivez un message en bas à gauche (ex : "Ajout maillot Arsenal")
4. Cliquez **"Commit to main"**
5. Cliquez **"Push origin"**

Le site est mis à jour en 1-2 minutes.

> Si vous utilisez Google Sheets, vous n'avez PAS besoin de faire un push après chaque modification de produit — seulement après avoir modifié les fichiers HTML/CSS/JS ou les images.

### Activer GitHub Pages (première fois)

1. Allez sur votre dépôt GitHub → **Settings** → **Pages**
2. Sous "Branch", choisissez `main` et le dossier `/ (root)`
3. Cliquez **Save**
4. Votre site sera sur `https://votre-pseudo.github.io/fcmaillot/`

---

## Questions fréquentes

**Les produits ne s'affichent pas en mode Google Sheets ?**
- Vérifiez que le Sheet est bien publié (Fichier → Partager → Publier sur le web)
- Vérifiez que le SHEET_ID dans `js/app.js` est correct (copiez-le depuis l'URL)
- Vérifiez que l'onglet s'appelle exactement `Produits` (P majuscule)

**Le site affiche "Impossible de charger les produits" ?**
- En local (sur votre ordinateur) : utilisez l'extension Live Server dans VS Code
- En ligne : vérifiez votre SHEET_ID et que le Sheet est publié

**Les images ne s'affichent pas ?**
Le nom de fichier dans Google Sheets doit correspondre exactement au fichier dans `images/produits/` (attention aux majuscules).

**Je veux revenir aux fichiers JSON ?**
Dans `js/app.js`, remettez : `const SHEET_ID = 'LOCAL';`

---

*Guide FC Maillot – Site statique HTML/CSS/JS avec intégration Google Sheets*
