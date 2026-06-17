# 📘 Guide Propriétaire – FC Maillot

Bienvenue ! Ce guide vous explique comment gérer votre site vous-même, sans connaissance technique.

---

## 🗂️ Structure du site

```
fcmaillot/
├── index.html          ← Page d'accueil
├── produits.html       ← Catalogue des maillots
├── produit.html        ← Fiche détail d'un maillot
├── contact.html        ← Page contact
├── data/
│   ├── config.json     ← ⭐ VOS INFOS (réseaux sociaux, nom, slogan...)
│   └── produits.json   ← ⭐ VOS PRODUITS
├── images/
│   ├── produits/       ← Photos des maillots
│   └── avis/           ← Photos des clients
└── css/ & js/          ← Ne pas modifier
```

---

## 1️⃣ Changer vos informations (nom, WhatsApp, Snapchat...)

Ouvrez le fichier `data/config.json` avec le Bloc-Notes.

**Changer le numéro WhatsApp :**
```json
"whatsapp": {
  "numero": "33612345678",   ← Remplacez par votre numéro (sans +, sans espaces)
```
Exemple pour le 06 12 34 56 78 : écrire `33612345678`

**Changer le profil Snapchat :**
```json
"snapchat": {
  "profil": "fcmaillot"   ← Mettez votre nom d'utilisateur Snapchat
```

**Changer le profil Instagram / TikTok :**
```json
"instagram": {
  "profil": "fcmaillot"   ← Mettez votre nom d'utilisateur
```

**Changer le slogan :**
```json
"slogan": "Maillots de foot à prix imbattables"
```

---

## 2️⃣ Ajouter un produit

Ouvrez `data/produits.json` avec le Bloc-Notes.

Ajoutez un bloc comme celui-ci à la fin de la liste (avant le `]` final) :

```json
,
{
  "id": "mon-nouveau-maillot",
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

> ⚠️ **Attention** : l'`id` doit être unique et sans espaces (utilisez des tirets).

**Catégories disponibles :**
- `clubs-francais`
- `clubs-espagnols`
- `clubs-anglais`
- `editions-speciales`
- `selections`

---

## 3️⃣ Modifier un produit existant

Ouvrez `data/produits.json`, trouvez le produit par son `nom` et modifiez les champs voulus.

**Changer le prix :**
```json
"prix": 40,
"prix_affiche": "40€",
```

**Rendre un produit indisponible (sans le supprimer) :**
```json
"disponible": false
```

**Mettre un produit en "Populaire" (affiché sur la page d'accueil) :**
```json
"populaire": true
```

---

## 4️⃣ Supprimer un produit

Dans `data/produits.json`, supprimez le bloc entier correspondant au produit :
```json
{
  "id": "...",
  ...
},    ← Supprimez tout jusqu'ici (y compris la virgule)
```

---

## 5️⃣ Ajouter une photo de maillot

1. Renommez votre photo en **lettres minuscules sans espaces**, ex : `arsenal-24.jpg`
2. Copiez-la dans le dossier `images/produits/`
3. Dans `produits.json`, mettez le chemin : `"image": "images/produits/arsenal-24.jpg"`

> ✅ Formats acceptés : `.jpg`, `.jpeg`, `.png`, `.webp`
> ✅ Taille recommandée : 600×600 pixels minimum, carré de préférence

---

## 6️⃣ Ajouter des avis clients

Ouvrez `data/config.json` et trouvez la section `avis_clients` :

```json
"avis_clients": [
  {
    "nom": "Lucas M.",
    "texte": "Super maillot, je recommande !",
    "photo": "images/avis/lucas.jpg",
    "note": 5
  },
  ...
]
```

Ajoutez un bloc similaire. Si vous n'avez pas de photo, mettez `"photo": ""`.

---

## 7️⃣ Publier les changements sur GitHub Pages

### Première fois (configuration initiale)

1. Créez un compte sur [github.com](https://github.com) si ce n'est pas fait
2. Cliquez sur **"New repository"** (nouveau dépôt)
3. Nommez-le `fcmaillot` (ou le nom que vous voulez)
4. Cochez **"Add a README file"**, puis cliquez **"Create repository"**
5. Téléchargez **GitHub Desktop** sur [desktop.github.com](https://desktop.github.com)
6. Dans GitHub Desktop, cliquez **"Clone a repository"** et choisissez votre dépôt
7. Copiez tous les fichiers de votre site dans le dossier cloné

### Publier les mises à jour

1. Ouvrez **GitHub Desktop**
2. Vous verrez la liste des fichiers modifiés à gauche
3. Écrivez un court message en bas à gauche (ex : "Ajout maillot Arsenal")
4. Cliquez **"Commit to main"**
5. Cliquez **"Push origin"** (en haut)

### Activer GitHub Pages

1. Sur GitHub, allez dans votre dépôt → **Settings** → **Pages**
2. Sous **"Branch"**, choisissez `main` et le dossier `/root`
3. Cliquez **Save**
4. Votre site sera en ligne sur `https://votre-pseudo.github.io/fcmaillot/` dans quelques minutes

---

## 8️⃣ Option avancée : Gérer les produits depuis Google Sheets

Si vous préférez gérer vos produits dans un tableur en ligne :

1. Créez un Google Sheets avec ces colonnes exactes :
   `id | nom | prix | prix_affiche | image | description | tailles | categorie | disponible | populaire`

2. Allez dans **Fichier → Partager → Publier sur le web**
   Choisissez : Feuille entière → Format JSON → Publier

3. Notez l'ID de votre Sheet (dans l'URL : `docs.google.com/spreadsheets/d/**VOTRE_ID**/...`)

4. Ouvrez `js/produits.js` et remplacez :
   ```javascript
   const URL_PRODUITS = 'data/produits.json';
   ```
   par :
   ```javascript
   const URL_PRODUITS = 'https://opensheet.elk.sh/VOTRE_ID_ICI/Feuille1';
   ```

5. Dans la colonne `tailles`, écrivez les tailles séparées par des virgules : `S,M,L,XL`

---

## ❓ Questions fréquentes

**Mon site ne s'affiche pas correctement en local ?**
Ouvrez le site via un serveur local (double-cliquer sur `index.html` peut bloquer les fichiers JSON).
Solution simple : utilisez l'extension **Live Server** dans VS Code.

**Les images ne s'affichent pas ?**
Vérifiez que le nom du fichier image dans `produits.json` correspond exactement au fichier dans `images/produits/` (attention aux majuscules).

**Les boutons WhatsApp/Snapchat n'ouvrent pas le bon compte ?**
Vérifiez `data/config.json`, section `reseaux`.

---

*Guide rédigé pour FC Maillot – Site statique HTML/CSS/JS*
