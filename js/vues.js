/* global state getQuizzes getUser */

// //////////////////////////////////////////////////////////////////////////////
// HTML : fonctions génération de HTML à partir des données passées en paramètre
// //////////////////////////////////////////////////////////////////////////////

// génération d'une liste de quizzes avec deux boutons en bas
const htmlQuizzesList = (quizzes, curr, total) => {
  console.debug(`@htmlQuizzesList(.., ${curr}, ${total})`);

  // un élement <li></li> pour chaque quizz. Noter qu'on fixe une donnée
  // data-quizzid qui sera accessible en JS via element.dataset.quizzid.
  // On définit aussi .modal-trigger et data-target="id-modal-quizz-menu"
  // pour qu'une fenêtre modale soit affichée quand on clique dessus
  // VOIR https://materializecss.com/modals.html
  const quizzesLIst = quizzes.map(
    (q) =>
      `<li class="collection-item modal-trigger cyan lighten-5" data-target="id-modal-quizz-menu" data-quizzid="${q.quiz_id}" id="Quizz${q.quiz_id}">
        <h5>${q.title}</h5>
        ${q.description} <a class="chip">${q.owner_id}</a>
      </li>`
  );

  // le bouton "<" pour revenir à la page précédente, ou rien si c'est la première page
  // on fixe une donnée data-page pour savoir où aller via JS via element.dataset.page
  const prevBtn =
    curr !== 1
      ? `<button id="id-prev-quizzes" data-page="${
          curr - 1
        }" class="btn"><i class="material-icons">navigate_before</i></button>`
      : "";

  // le bouton ">" pour aller à la page suivante, ou rien si c'est la première page
  const nextBtn =
    curr !== total
      ? `<button id="id-next-quizzes" data-page="${
          curr + 1
        }" class="btn"><i class="material-icons">navigate_next</i></button>`
      : "";

  // La liste complète et les deux boutons en bas
  const html = `
  <ul class="collection">
    ${quizzesLIst.join("")}
  </ul>
  <div class="row">      
    <div class="col s6 left-align">${prevBtn}</div>
    <div class="col s6 right-align">${nextBtn}</div>
  </div>
  `;
  return html;
};

// génération de la liste de mes quizz
const htmlMyQuizzesList = (myQuizz) => {
  console.debug(`@htmlMyQuizzesList(..)`);
  const myQuizzesLIst = myQuizz.map(
    (q) =>
      `<li class="collection-item modal-trigger cyan lighten-5" data-target="id-modal-myQuizz-menu" data-quizzid="${q.quiz_id}" id="Quizz${q.quiz_id}">
        <h5>${q.title}</h5>
        ${q.description} <a class="chip">${q.owner_id}</a>
      </li>`
  );

  // La liste complète de mes quizz
  const html = `
  <ul class="collection">
    ${myQuizzesLIst.join("")}
  </ul>
  `;
  return html;
};

// Génération des questions d'un quizz (Page Mes Quizz)
const htmlQuestionsList = (questions) => {
  console.debug(`@htmlQuestionsList(..)`);
  const propositionsContent = (propositions, IdQuestion) => {
    return propositions.map(
      (p) => ` 
    <p>
      <label>
        <input type="radio" onchange="formQCM(${IdQuestion},${p.proposition_id})" name="${IdQuestion}" value="${p.proposition_id}"/> 
        <span>${p.content}</span>
      </label>
    </p>`
    );
  };

  const questionsLIst = questions.map(
    (q) =>
      `<blockquote for="${q.question_id}">
      ${q.sentence}
      </blockquote> 
       ${propositionsContent(q.propositions, q.question_id).join("")}
       `
  );

  // La liste complète des questions et des propositions
  const html = `${questionsLIst.join("")}`;
  return html;
};

// génération de la liste des quizz auquel j'ai répondu
const htmlReponsesList = (reponses) => {
  console.debug(`@htmlReponsesList(..)`);
  const myReponsesLIst = reponses.map(
    (q) =>
      `<li class="collection-item modal-trigger cyan lighten-5" data-target="id-modal-answers-menu" data-quizzid="${q.quiz_id}">
        <h5>${q.title}</h5>
        ${q.description} <a class="chip">${q.owner_id}</a>
      </li>`
  );

  // La liste complète des quizz (Page Mes Réponses)
  const html = `
  <ul class="collection">
    ${myReponsesLIst.join("")}
  </ul>
  `;
  return html;
};

// Génération des questions d'un quizz (Page Mes Réponses)
const htmlReponsesQuestions = (IDquizz, questions, reponses) => {
  console.debug(`@htmlReponsesQuestions(..)`);
  console.log(questions);
  console.log(reponses.answers);
  const reponsesContent = (IdQuestion, propositionId) => {
    return reponses.answers.find(
      (p) => p.question_id === IdQuestion && p.proposition_id === propositionId
    );
  };

  const propositionsContent = (propositions, IdQuestion) => {
    return propositions.map(
      (p) => ` 
      <p>
        <label>
          <input type="radio" name="${IdQuestion}" value="${
        p.proposition_id
      }" onchange="formQCM(${IdQuestion},${p.proposition_id})" ${
        reponsesContent(IdQuestion, p.proposition_id) ? "checked" : " "
      }/> 
          <span>${p.content}</span>
        </label>
      </p>`
    );
  };

  const questionsLIst = questions.map(
    (q) =>
      `<blockquote for="${q.question_id}">
        ${q.sentence}
        </blockquote> 
         ${propositionsContent(q.propositions, q.question_id).join("")}
         `
  );

  // La liste complète des questions et des propositions
  const html = ` <div class="card-panel teal lighten-2">Vous pouvez modifier vos réponses et elles seront envoyés au serveur </div> 
                 ${questionsLIst.join("")}
                    `;
  return html;
};

/*-------------------------------------------------------------------ONGLET 1 - Tous les Quizz-------------------------------------------------------------------*/

// //////////////////////////////////////////////////////////////////////////////
// RENDUS : mise en place du HTML dans le DOM et association des événemets
// //////////////////////////////////////////////////////////////////////////////

// met la liste HTML dans le DOM et associe les handlers aux événements
function renderQuizzes() {
  console.debug(`@renderQuizzes()`);

  // les éléments à mettre à jour : le conteneur pour la liste des quizz
  const usersElt = document.getElementById("id-all-quizzes-list");
  const main = document.getElementById("id-all-quizzes-main");
  // une fenêtre modale définie dans le HTML
  const modal = document.getElementById("id-modal-quizz-menu");

  usersElt.innerHTML = htmlQuizzesList(
    state.quizzes.results,
    state.quizzes.currentPage,
    state.quizzes.nbPages
  );

  main.innerHTML = "séléctioné un quizz";

  // on appelle la fonction de généraion et on met le HTML produit dans le DOM

  // /!\ il faut que l'affectation usersElt.innerHTML = ... ait eu lieu pour
  // /!\ que prevBtn, nextBtn et quizzes en soient pas null
  // les éléments à mettre à jour : les boutons
  const prevBtn = document.getElementById("id-prev-quizzes");
  const nextBtn = document.getElementById("id-next-quizzes");
  // la liste de tous les quizzes individuels
  const quizzes = document.querySelectorAll("#id-all-quizzes-list li");

  // les handlers quand on clique sur "<" ou ">"
  function clickBtnPager() {
    // remet à jour les données de state en demandant la page
    // identifiée dans l'attribut data-page
    // noter ici le 'this' QUI FAIT AUTOMATIQUEMENT REFERENCE
    // A L'ELEMENT AUQUEL ON ATTACHE CE HANDLER
    getQuizzes(this.dataset.page);
  }
  if (prevBtn) prevBtn.onclick = clickBtnPager;
  if (nextBtn) nextBtn.onclick = clickBtnPager;
  // qd on clique sur un quizz, on change sont contenu avant affichage
  // l'affichage sera automatiquement déclenché par materializecss car on
  // a définit .modal-trigger et data-target="id-modal-quizz-menu" dans le HTML
  function clickQuiz() {
    const quizzId = this.dataset.quizzid;
    console.debug(`@clickQuiz(${quizzId})`);
    const addr = `${state.serverUrl}/quizzes/${quizzId}`;
    const html = `
    <p>Vous pouvez maintenant répondre aux questions du quizz<p>`;
    modal.children[0].innerHTML = html;
    state.currentQuizz = quizzId;
    // eslint-disable-next-line no-use-before-define
    renderCurrentQuizz();
  }

  // pour chaque quizz, on lui associe son handler
  quizzes.forEach((q) => {
    q.onclick = clickQuiz;
  });
}

/*-------------------------------------------------------------------ONGLET 2 - Mes Quizz-------------------------------------------------------------------*/

function renderMyQuizzes() {
  console.debug(`@renderMyQuizzes()`);

  // les éléments à mettre à jour : le conteneur pour la liste des quizz
  const myQuizzes = document.getElementById("id-my-quizzes-list");
  const main = document.getElementById("id-my-quizzes-main");
  // une fenêtre modale définie dans le HTML
  const modal = document.getElementById("id-modal-myQuizz-menu");
  const createQuiz = document.getElementById("create-quiz");
  createQuiz.innerHTML = `<a class="btn-floating btn-medium cyan pulse"><i class="material-icons">add</i></a>`;
  // on appelle la fonction de généraion et on met le HTML produit dans le DOM

  myQuizzes.innerHTML = htmlMyQuizzesList(state.myQuizzes);
  main.innerHTML = "séléctioné un quizz";
  //main.innerHTML = `Ici les détails pour le quizz #${state.currentQuizz}`;

  const quizzes = document.querySelectorAll("#id-my-quizzes-list li");

  // qd on clique sur un quizz, on change sont contenu avant affichage
  // l'affichage sera automatiquement déclenché par materializecss car on
  // a définit .modal-trigger et data-target="id-modal-quizz-menu" dans le HTML
  function clickMyQuiz() {
    const myQuizzId = this.dataset.quizzid;
    console.debug(`@clickMyQuiz(${myQuizzId})`);
    const html = `
      <p>Vous pouvez maintenant regardé les quesions de votre quizz<p>.`;
    modal.children[0].innerHTML = html;
    state.currentQuizz = myQuizzId;
    renderCurrentMyQuizz();
  }
  createQuiz.onclick = () => {
    renderCreateQuiz();
  };

  // pour chaque quizz, on lui associe son handler
  quizzes.forEach((q) => {
    q.onclick = clickMyQuiz;
  });
}

function renderCurrentMyQuizz() {
  getMyQuestions(state.currentQuizz);
}

function renderMyQuestions() {
  const main = document.getElementById("id-my-quizzes-main");
  main.innerHTML = htmlQuestionsList(state.questions);
  //formQCM();
}

function renderCurrentQuizz() {
  getQuestions(state.currentQuizz);
}

function renderCurrentMyAnswers() {
  getQuestionsForAnswers(state.currentQuizz);
}

function renderQuestions() {
  const main = document.getElementById("id-all-quizzes-main");
  main.innerHTML = htmlQuestionsList(state.questions);
  //formQCM();
}

/*-------------------------------------------------------------------ONGLET 3 - Mes Réponses-------------------------------------------------------------------*/

function renderMyAnswers() {
  const list = document.getElementById("id-my-answers-list");
  list.innerHTML = htmlReponsesList(state.reponses);
  const main = document.getElementById("id-my-answers-main");
  const modal = document.getElementById("id-modal-answers-menu");
  const answers = document.querySelectorAll("#id-my-answers-list li");

  function clickMyAnswers() {
    const QuizzId = this.dataset.quizzid;
    console.debug(`@clickMyAnswers(${QuizzId})`);
    const html = `<p>Vous pouvez maintenant voir vos réponses aux questions du quizz<p>.`;
    state.currentQuizz = QuizzId;
    modal.children[0].innerHTML = html;
    renderCurrentMyAnswers();
    console.log(state.questions);
    const ReponseForQuizz = state.reponses.find(
      (e) => e.quiz_id === Number(QuizzId)
    );
    main.innerHTML = htmlReponsesQuestions(
      QuizzId,
      state.questions,
      ReponseForQuizz
    );
    console.log("a la fin fonction");
  }

  // pour chaque quizz, on lui associe son handler
  answers.forEach((q) => {
    q.onclick = clickMyAnswers;
  });
}

/*-------------------------------------------------------------------Autres Fonctions-------------------------------------------------------------------*/

// Bouton Login
const renderUserBtn = () => {
  console.debug(`@renderUserBtn()`);
  const modal = document.getElementById("id-modal-connexion");
  const bouton = document.getElementById("bouton");
  const btn = document.getElementById("id-login");
  btn.classList.add("modal-trigger");
  btn.dataset.target = "id-modal-connexion";
  if (state.user) {
    getMyAnswers();
    getMyQuizzes();

    btn.innerHTML = "exit_to_app";
  }
  btn.onclick = () => {
    if (state.user) {
      modal.children[0].innerHTML = `<h3>Utilisateur connecté</h3></br><h5>${state.user.firstname} ${state.user.lastname}</h5>`;
      bouton.innerHTML = "Se déconnecter";
      bouton.onclick = () => {
        state.xApiKey = "";
        state.user = undefined;
        btn.innerHTML = "face";
        getUser();
      };
    } else {
      modal.children[0].innerHTML = `<h3>Utilisateur non connecté </h3></br>
      <form action="#">
          <div class="input-field">
              <i class="material-icons prefix">person</i>
              <input id="ApiKey" type="text">
              <label>Saisissez votre ApiKey</label>
          </div>
      <form>`;
      bouton.innerHTML = "Se connecter";
      bouton.onclick = () => {
        state.xApiKey = document.getElementById("ApiKey").value;
        if (state.xApiKey != "") {
          btn.innerHTML = "exit_to_app";
        }
        getUser();
      };
    }
  };
};

// Barre de recherche
function resultSearch(input) {
  if (input.value === null) {
    console.log("Valeur de recherche null");
  } else {
    const changeCSS = (quizzID) => {
      quizzID = "Quizz" + quizzID;
      const el = document.getElementById(quizzID);
      if (el === null) {
        console.log("recherche");
      } else {
        el.setAttribute("style", "background-color:green !important");
      }
    };
    state.search.map((p) => changeCSS(p.quiz_id));
  }
}

function renderCreateQuiz() {
  const main = document.getElementById("id-my-quizzes-main");
  const addQuestion = document.getElementById("add-question");
  const addProposition = document.getElementById("add-proposition");
  main.innerHTML = `
  <form action="#" id="newQuiz">
    <div class="input-field">
      <input name="quizName" type="text" class="validate">
      <label for="quizName">Nom du Quiz</label>
    <div class="input-field">
      <textarea name="quizDescription" class="materialize-textarea"></textarea>
      <label for="quizDescription">Description du Quiz</label>
    </div>
  </div>
  <div id="ajoutQuestion"> </div>
  <button class="btn waves-effect waves-light" type="submit" name="action">Envoyer<i class="material-icons right">send</i></button>
 </form> `;
  addQuestion.innerHTML = `<a class="btn-floating btn-medium cyan "><i class="material-icons">add_circle_outline</i></a>`;
  const ajoutQuestion = document.getElementById("ajoutQuestion");
  addQuestion.onclick = () => {
    ajoutQuestion.innerHTML += `
    <div class="input-field">
      <input id="quizQuestion" type="text" class="validate">
      <label for="quizQuestion">Question</label>
    </div>`;
    addProposition.innerHTML = `<a class="btn-floating btn-medium cyan "><i class="material-icons">library_add</i></a>`;
    addProposition.onclick = () => {
      ajoutQuestion.innerHTML += `<div class="input-field">
      <input id="quizProposition" type="text" class="validate">
      <label for="quizProposition">Proposition de réponse</label>
    </div>`;
    };
  };

  CreateMyQuiz();
}

function effacer() {
  const main = document.getElementById("id-my-answers-main");
  main.innerHTML = "";
}
