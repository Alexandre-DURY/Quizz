/* globals renderQuizzes renderUserBtn */

// //////////////////////////////////////////////////////////////////////////////
// LE MODELE, a.k.a, ETAT GLOBAL
// //////////////////////////////////////////////////////////////////////////////

// un objet global pour encapsuler l'état de l'application
// on pourrait le stocker dans le LocalStorage par exemple
const state = {
  // la clef de l'utilisateur
  xApiKey: "", //7d59aea3-171f-4dae-b290-9603f46a50d6

  // l'URL du serveur où accéder aux données
  serverUrl: "https://lifap5.univ-lyon1.fr",

  // la liste des quizzes
  quizzes: [],

  // la liste des mes quizzes
  myQuizzes: [],

  // la liste des questions
  questions: [],

  // la liste de mes réponses
  reponses: [],

  // liste recherche
  search: [],

  // le quizz actuellement choisi
  currentQuizz: undefined,

  // une méthode pour l'objet 'state' qui va générer les headers pour les appel à fetch
  headers() {
    const headers = new Headers();
    headers.set("X-API-KEY", this.xApiKey);
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    return headers;
  },
};

// //////////////////////////////////////////////////////////////////////////////
// OUTILS génériques
// //////////////////////////////////////////////////////////////////////////////

// un filtre simple pour récupérer les réponses HTTP qui correspondent à des
// erreurs client (4xx) ou serveur (5xx)
// eslint-disable-next-line no-unused-vars
function filterHttpResponse(response) {
  return response
    .json()
    .then((data) => {
      if (response.status >= 400 && response.status < 600) {
        throw new Error(`${data.name}: ${data.message}`);
      }
      return data;
    })
    .catch((err) => console.error(`Error on json: ${err}`));
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// //////////////////////////////////////////////////////////////////////////////
// DONNEES DES UTILISATEURS
// //////////////////////////////////////////////////////////////////////////////

// mise-à-jour asynchrone de l'état avec les informations de l'utilisateur
// l'utilisateur est identifié via sa clef X-API-KEY lue dans l'état
// eslint-disable-next-line no-unused-vars
const getUser = () => {
  console.debug(`@getUser()`);
  const url = `${state.serverUrl}/users/whoami`;
  return fetch(url, { method: "GET", headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      // /!\ ICI L'ETAT EST MODIFIE /!\
      state.user = data;
      console.log(state.user);
      // on lance le rendu du bouton de login
      return renderUserBtn();
    });
};

// //////////////////////////////////////////////////////////////////////////////
// DONNEES DES QUIZZES
// //////////////////////////////////////////////////////////////////////////////

// mise-à-jour asynchrone de l'état avec les informations de l'utilisateur
// getQuizzes télécharge la page 'p' des quizzes et la met dans l'état
// puis relance le rendu
// eslint-disable-next-line no-unused-vars
const getQuizzes = (p = 1) => {
  console.debug(`@getQuizzes(${p})`);
  const url = `${state.serverUrl}/quizzes/?page=${p}`;

  // le téléchargement est asynchrone, là màj de l'état et le rendu se fait dans le '.then'
  return fetch(url, { method: "GET", headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      // /!\ ICI L'ETAT EST MODIFIE /!\
      state.quizzes = data;
      // on a mis à jour les donnés, on peut relancer le rendu
      // eslint-disable-next-line no-use-before-define
      return renderQuizzes();
    });
};

// //////////////////////////////////////////////////////////////////////////////
// DONNEES DES MES QUIZZES
// //////////////////////////////////////////////////////////////////////////////

// mise-à-jour asynchrone de l'état avec les informations de l'utilisateur
// getMyQuizzes télécharge la page 'p' des quizzes et la met dans l'état
// puis relance le rendu
// eslint-disable-next-line no-unused-vars
const getMyQuizzes = () => {
  console.debug(`@getMyQuizzes()`);
  const url = `${state.serverUrl}/users/quizzes`;

  // le téléchargement est asynchrone, là màj de l'état et le rendu se fait dans le '.then'
  return fetch(url, { method: "GET", headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      // /!\ ICI L'ETAT EST MODIFIE /!\
      state.myQuizzes = data;
      // on a mis à jour les donnés, on peut relancer le rendu
      return renderMyQuizzes();
    });
};

//Récupère les questions d'un quizz selon l'id
const getQuestions = (id) => {
  console.debug(`@getQuestions(${id})`);
  const url = `${state.serverUrl}/quizzes/${id}/questions`;

  // le téléchargement est asynchrone, là màj de l'état et le rendu se fait dans le '.then'
  return fetch(url, { method: "GET", headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      // /!\ ICI L'ETAT EST MODIFIE /!\
      console.log(data);
      state.questions = data;
      // on a mis à jour les donnés, on peut relancer le rendu
      return renderQuestions();
    });
};

// Récupère les questions d'un quizz selon l'id (Pour la page Mes Quizz)
const getMyQuestions = (id) => {
  console.debug(`@getMyQuestions(${id})`);
  const url = `${state.serverUrl}/quizzes/${id}/questions`;

  // le téléchargement est asynchrone, là màj de l'état et le rendu se fait dans le '.then'
  return fetch(url, { method: "GET", headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      // /!\ ICI L'ETAT EST MODIFIE /!\
      state.questions = data;
      // on a mis à jour les donnés, on peut relancer le rendu
      return renderMyQuestions();
    });
};

// Récupère les questions d'un quizz selon l'id  (Pour la page Mes Réponses)
const getQuestionsForAnswers = (id) => {
  console.debug(`@getQuestionsForAnswers(${id})`);
  const url = `${state.serverUrl}/quizzes/${id}/questions`;

  // le téléchargement est asynchrone, là màj de l'état et le rendu se fait dans le '.then'
  return fetch(url, { method: "GET", headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      // /!\ ICI L'ETAT EST MODIFIE /!\
      state.questions = data;

      // on a mis à jour les donnés, on peut relancer le rendu
      return renderMyAnswers();
    });
};

// Récupère les réponses d'un utilisateur
const getMyAnswers = () => {
  sleep(100);
  console.debug(`@getMyAnswers()`);
  const url = `${state.serverUrl}/users/answers`;

  // le téléchargement est asynchrone, là màj de l'état et le rendu se fait dans le '.then'
  return fetch(url, { method: "GET", headers: state.headers() })
    .then(filterHttpResponse)
    .then((data) => {
      // /!\ ICI L'ETAT EST MODIFIE /!\
      state.reponses = data;
      // on a mis à jour les donnés, on peut relancer le rendu
      return renderMyAnswers();
    });
};

function formQCM(idQuestion, idProp) {
  console.debug(`@formQCM()`);
  fetch(
    `${state.serverUrl}/quizzes/${state.currentQuizz}/questions/${idQuestion}/answers/${idProp}`,
    {
      method: "POST",
      headers: state.headers(),
    }
  )
    .then(filterHttpResponse)
    .then((r) => {
      M.toast({
        displayLength: 4000,
        html: ` <div class="preloader-wrapper small active">
            <div class="spinner-layer spinner-green-only">
              <div class="circle-clipper left">
                <div class="circle"></div>
              </div><div class="gap-patch">
                <div class="circle"></div>
              </div><div class="circle-clipper right">
                <div class="circle"></div>
              </div>
            </div>
          </div> <div style="margin-left: 20px;" >Envoie de Votre réponse à la question ${r.question_id} du quizz ${r.quiz_id} </div>
             `,
      });
    });
  getMyAnswers();
}

const CreateMyQuiz = () => {
  const form = document.getElementById("newQuiz");
  form.onsubmit = function (a) {
    getMyQuizzes();
    console.log("envoie !");
    a.preventDefault();
    const formData = new FormData(this);
    const data = {};
    console.log(formData);
    const quizName = formData.get("quizName");
    const quizDescription = formData.get("quizDescription");
    const donnee = {
      title: `${quizName}`,
      description: `${quizDescription}`,
    };
    fetch(`${state.serverUrl}/quizzes/`, {
      method: "POST",
      headers: state.headers(),
      body: JSON.stringify(donnee),
    })
      .then(filterHttpResponse)
      .then(() => {
        M.toast({
          displayLength: 4000,
          html: `quizz créé par ${state.user.user_id}`,
        });
      });
  };
};

const getSearch = () => {
  console.debug(`@getSearch()`);
  const input = document.getElementById("search");
  const url = `${state.serverUrl}/search/?q=${input.value}`;
  // le téléchargement est asynchrone, là màj de l'état et le rendu se fait dans le '.then'
  fetch(url, {
    method: "GET",
    headers: state.headers(),
  })
    .then(filterHttpResponse)
    .then((data) => {
      state.search = data;
    })
    .then(resultSearch(input));
};
