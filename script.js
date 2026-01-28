//---------------------------------------------
// 🔥 CONFIGURACIÓN DE FIREBASE
//---------------------------------------------
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  databaseURL: "TU_DATABASE_URL",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Base de datos
const db = firebase.database();


//---------------------------------------------
// 🧱 FUNCIONES PARA GUARDAR Y MOSTRAR PACKS
//---------------------------------------------

// Guarda un pack nuevo en la base de datos
function guardarPack(packData) {
  const id = Date.now(); // crea un ID único
  db.ref("packs/" + id).set(packData);
  alert("✅ Pack subido correctamente a la base de datos!");
}


// Carga y muestra todos los packs
function cargarPacks() {
  db.ref("packs").on("value", snapshot => {
    const packs = snapshot.val() || {};
    mostrarPacks(packs);
  });
}


//---------------------------------------------
// 💻 FUNCIÓN QUE MUESTRA LOS PACKS EN LA WEB
//---------------------------------------------

function mostrarPacks(packs) {
  const contenedor = document.querySelector(".packs");
  if (!contenedor) return;

  contenedor.innerHTML = ""; // limpiar antes de mostrar

  for (const id in packs) {
    const pack = packs[id];

    const div = document.createElement("div");
    div.className = "pack";
    div.innerHTML = `
      <img src="${pack.imagen}" alt="${pack.nombre}">
      <h3>${pack.nombre}</h3>
      <p>• By ${pack.autor} •</p>
      <a href="descarga.html?id=${id}" class="download-btn">Descargar</a>
    `;

    contenedor.appendChild(div);
  }
}


//---------------------------------------------
// 🧩 DETECTA CUÁNDO SE SUBE UN PACK (en subir.html)
//---------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const subirBtn = document.getElementById("upload-confirm");

  if (subirBtn) {
    subirBtn.addEventListener("click", () => {
      const nombre = document.getElementById("pack-name").value;
      const autor = document.getElementById("pack-author").value;
      const descripcion = document.getElementById("pack-desc").value;
      const imagen = document.getElementById("pack-img").value;
      const archivo = document.getElementById("pack-file").value;
      const youtube = document.getElementById("pack-yt").value || "";

      if (!nombre || !autor || !descripcion || !imagen || !archivo) {
        alert("⚠️ Rellena todos los campos antes de subir.");
        return;
      }

      const packData = { nombre, autor, descripcion, imagen, archivo, youtube };
      guardarPack(packData);
    });
  }

  // Si estamos en index.html, carga los packs
  if (document.querySelector(".packs")) {
    cargarPacks();
  }
});
