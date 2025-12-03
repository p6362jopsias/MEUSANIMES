import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getDatabase, ref, push, update, remove, onValue 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { 
  getAuth, signInAnonymously 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔥 CONFIG DO SEU FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCbK8wf20sq8gxRV1xwdS_P9Os4tjwelYU",
  authDomain: "meu-streamer.firebaseapp.com",
  databaseURL: "https://meu-streamer-default-rtdb.firebaseio.com/",
  projectId: "meu-streamer",
  storageBucket: "meu-streamer.firebasestorage.app",
  messagingSenderId: "1023448042216",
  appId: "1:1023448042216:web:2855d9664ac6aff651175d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

// Login anônimo
signInAnonymously(auth).then(() => {
  console.log("Logado anonimamente.");
});

// Referência no banco
const animeRef = ref(db, "animes");

// ------------------------
// SALVAR ANIME
// ------------------------
window.saveAnime = function () {
  const nome = document.getElementById("anime-name").value;
  const ep = document.getElementById("anime-episode").value;
  const capa = document.getElementById("anime-cover").value;
  const link = document.getElementById("anime-link").value;

  if (!nome || !ep || !capa || !link) {
    alert("Preencha tudo!");
    return;
  }

  push(animeRef, {
    nome,
    episodio: parseInt(ep),
    capa,
    link,
    atualizado: Date.now()
  });

  document.getElementById("anime-name").value = "";
  document.getElementById("anime-episode").value = "";
  document.getElementById("anime-cover").value = "";
  document.getElementById("anime-link").value = "";
};

// ------------------------
// LISTAR EM TEMPO REAL
// ------------------------
onValue(animeRef, (snapshot) => {
  const list = document.getElementById("anime-list");
  const contList = document.getElementById("continue-list");

  list.innerHTML = "";
  contList.innerHTML = "";

  snapshot.forEach((child) => {
    const a = child.val();
    const id = child.key;

    const card = `
      <div class="card">
        <img src="${a.capa}">
        <h4>${a.nome}</h4>
        <p>Episódio: ${a.episodio}</p>
        <button onclick="assistir('${id}', '${a.link}')">Assistir</button>
        <button onclick="episodioMais('${id}', ${a.episodio})">+1 episódio</button>
        <button onclick="deletar('${id}')">Excluir</button>
      </div>
    `;

    list.innerHTML += card;

    // Continuar assistindo = últimos atualizados
    if (a.episodio > 0) contList.innerHTML += card;
  });
});

// ------------------------
// AÇÕES
// ------------------------
window.assistir = function(id, link) {
  update(ref(db, "animes/" + id), { atualizado: Date.now() });
  window.location.href = link;
};

window.episodioMais = function(id, atual) {
  update(ref(db, "animes/" + id), { episodio: atual + 1, atualizado: Date.now() });
};

window.deletar = function(id) {
  remove(ref(db, "animes/" + id));
};

// ------------------------
// BUSCA
// ------------------------
document.getElementById("search").addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(c => {
    const nome = c.querySelector("h4").innerText.toLowerCase();
    c.style.display = nome.includes(termo) ? "block" : "none";
  });
});

// ------------------------
// MODO ESCURO
// ------------------------
document.getElementById("darkModeToggle").onclick = () => {
  document.body.classList.toggle("light");
};