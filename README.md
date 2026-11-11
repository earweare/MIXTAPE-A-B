# MIXTAPE A-B

Station de mixage de deux playlists YouTube, par DSF.

Version en ligne : https://double-playlist-dsf.earweare.chatgpt.site

## Fonctionnalités

- Deux playlists visibles, avec titres et vignettes des morceaux.
- Lecture, pause, navigation, volume et vitesse par platine.
- Volume et transport généraux.
- Crossfader manuel ou automatique vers A/B, durée en millisecondes.
- Boucles de passage avec repères d’entrée et de sortie.
- Enregistrement et rappel de mixtapes nommées dans le navigateur.

## Lancer en local

Aucune installation de dépendances ni compilation nécessaire. Avec Python 3, depuis la racine du dépôt :

```sh
python3 -m http.server 8000 --directory dist
```

Ouvrir http://localhost:8000. Une connexion Internet est nécessaire pour YouTube. Pour publier, servir le contenu du dossier `dist/` sur un hébergement HTTPS.

## Organisation

Les fichiers HTML, CSS, JavaScript et les images sont dans `dist/`. Les réglages et les mixtapes sont stockés dans le localStorage du navigateur : ils ne sont pas transférés avec le code et restent propres au navigateur et à l’adresse du site.

L’enregistrement d’une mixtape sauvegarde ses réglages, pas un fichier audio. La lecture dépend des autorisations d’intégration des vidéos et du navigateur. Les boucles YouTube ne garantissent pas une jonction sans interruption. Le BPM/TAP et la synchronisation du fondu au tempo sont des pistes discutées, non implémentées dans cette version.

Source importée depuis la version publiée 15, commit `b88f8c7fa2c10cf0a4ffe4840980c924d161638b`.

DSF©2026
