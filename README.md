# VillaNova 

Application web de centralisation des événements culturels de Marseille.

## Présentation

VillaNova est une plateforme front-end qui permet de découvrir, filtrer et explorer les événements culturels de Marseille et ses alentours (concerts, expositions, théâtre, festivals...). Les données sont récupérées en temps réel depuis l'API OpenAgenda.

## Fonctionnalités

-  Recherche d'événements par mot-clé
-  Filtrage par catégorie (Concerts, Expositions, Théâtre, Festivals, Gratuit)
-  Pagination dynamique
-  Fiche détaillée de chaque événement
-  Design responsive (mobile, tablette, desktop)
- ♿ Accessibilité WCAG AA (aria-label, focus visible, navigation clavier)

## Stack technique

- HTML5 sémantique
- CSS3 (Flexbox, Grid, variables CSS, media queries)
- JavaScript vanilla (ES6+, Fetch API, async/await)
- API externe : [OpenAgenda](https://openagenda.com)

## Structure du projet

```
vilanova/
├── index.html              # Page d'accueil
├── events.html             # Liste des événements
├── event_detail.html       # Fiche détail d'un événement
├── profile.html            # Page profil
├── home_page.css           # Feuille de style principale
├── home_page.js            # JavaScript principal
├── event_detail.js         # JavaScript page détail
└── sub_files/
    ├── information.html    # Qui sommes-nous
    ├── contact.html        # Contact
    ├── CGU.html            # Conditions générales
    ├── confidentialities.html  # Politique de confidentialité
    └── cookies.html        # Gestion des cookies
```

## Installation

1. Clone le dépôt :
```bash
git clone https://github.com/cylia-ouldamara/Villa-Nova.git
```

2. Ouvre le dossier dans VS Code

3. Lance avec **Live Server** (clic droit sur `index.html` → *Open with Live Server*)

> ⚠️ Ne pas ouvrir les fichiers directement dans le navigateur — les appels API seront bloqués par CORS.

## API OpenAgenda

Les événements proviennent de l'agenda public Marseille via l'API OpenAgenda v2.

- Agenda ID : `21769447`
- Endpoint : `https://api.openagenda.com/v2/agendas/21769447/events`
- Documentation : [api.openagenda.com](https://api.openagenda.com)

> La clé API utilisée est une clé publique en lecture seule.

## Auteur

Cylia Ould Amara — La Plateforme_, Marseille  
Projet réalisé dans le cadre du Bachelor Informatique (Systèmes & Réseaux)

[GitHub](https://github.com/cylia-ouldamara/Villa-Nova)