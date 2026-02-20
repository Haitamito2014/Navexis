# Navexis — Site vitrine (FR/EN)

Ce projet est un site **statique** (HTML/CSS/JS), prêt à être publié sur GitHub.

## Structure
- `index.html` : page FR (one-page)
- `en/index.html` : page EN
- `assets/css/styles.css`
- `assets/js/main.js`
- `assets/img/*`

Les anciennes pages (`services.html`, `contact.html`, etc.) redirigent vers la nouvelle structure.

## Formulaire de contact (important)

### Limite des sites statiques
GitHub Pages **ne peut pas exécuter de code serveur** (PHP/Node).  
Donc un “envoi direct” d’email **sans** service externe n’est pas possible.

### Mode par défaut (100% statique)
Le formulaire ouvre le client mail de l’utilisateur (`mailto:contact@navexistech.com`) avec le message pré-rempli.

### Envoi automatique recommandé (Formspree)
1. Créez un formulaire Formspree et définissez le destinataire sur **contact@navexistech.com**.
2. Récupérez votre endpoint du type `https://formspree.io/f/xxxxxxxx`
3. Ouvrez `assets/js/main.js` et renseignez :
   ```js
   const FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
   ```
4. Publiez.

> Variante possible : Netlify Forms, Cloudflare Pages Functions, etc.

## Déploiement GitHub Pages (simple)
- Repo GitHub → Settings → Pages → Deploy from branch → `/ (root)`.

## Personnalisation
- Couleurs : `assets/css/styles.css` (variables CSS `--brand0`, `--brand1`, etc.)
- SEO : balises `meta` dans `index.html` et `en/index.html`
