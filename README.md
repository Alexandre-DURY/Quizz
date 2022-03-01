LIFAP5 - projet 2019-2020 : gestionnaire de QCM
===============================================

* SALLE Grégory 
* DURY Alexandre


Fonctionnalités essentielles
----------------------------

* [x] **Modifier l'utilisateur connecté** : il faut pour cela remplir la champ `xApiKey` de l'objet `state` déclaré dans `js/modeles.js`. Comprendre le fonctionnement permettant le mise à jour de l'état (dans `js/modeles.js`) et la modification du comportement du bouton "utilisateur" (dans `js/vues.js`). Ensuite, il faut permettre de choisir l'utilisateur avec lequel on se connecte et se délogguer le cas échéant.
* [X] **Afficher les questions et les propositions d'un quiz** : lorsque l'on clique sur un quiz, la fonction `clickQuiz` (définie dans `js/vues.js`) est appelée. Elle appelle `renderCurrentQuizz` qui va changer l'affichage du div HTML `id-all-quizzes-main`. Modifier ces fonctions de façon à afficher les questions (et leurs propositions de réponses) du quiz au lieu de "Ici les détails pour le quiz _xxyyzz_".
* [X] **Répondre à un quiz**: modifier l'affichage précédent de façon à pouvoir répondre au quiz, c'est-à-dire pouvoir cocher la réponse choisie à chaque question, puis cliquer sur un bouton "Répondre" qui enverra les réponses au serveur.
* [X] **Afficher les quiz de l'utilisateur connecté et des réponses déjà données** : reprendre la fonctionnalité d'affichage de tous les quiz et l'adapter pour afficher les quiz de l'utilisateur connecté dans l'onglet "MES QUIZ". Similairement, remplir l'onglet "MES REPONSES" pour afficher les quiz auxquels l'utilisateur connecté a répondu
* [X] **Créer un quiz pour l'utilisateur connecté** : ajouter un formulaire permettant de saisir les informations d'un nouveau quiz dans l'onglet "MES QUIZ". Ajouter un bouton "Créer" qu déclenchera l'ajout du quiz sur le serveur et le rafraîchissement de la liste des quiz. Permettre d'ajouter aux quiz de l'utilisateur connecté un formulaire d'ajout de question. Ce formulaire permettra de saisir les propositions possibles pour la question. Sa validation déclenchera l'ajout de la question sur le serveur.

Fonctionnalités plus spécifiques
---------------------------------------

* [X] Catégorie **gestion des réponses**
  - Modifier les réponses à un quiz auquel on a déjà répondu: Lorsque l'on a déjà répondu à un quiz, modifier le formulaire de réponse de façon à ce que le contenu du formulaire soit pré-rempli avec les réponses de l'utilisateur.
  - Se passer du bouton "Répondre" dans le formulaire de réponse: à chaque fois qu'une case est cochée, mettre directement à jour le serveur avec la réponse choisie par l'utilisateur.

* [X] Catégorie **formulaire de recherche**
  - Le formulaire de recherche en haut de la page permet de recherche en texte plein sur tous les champ de texte des quiz, des questions et des propositions. Changer le comportement de l'onglet "TOUS LES QUIZ" mette en surbrillance les éléments au 
