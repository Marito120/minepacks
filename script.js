const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  databaseURL: "TU_DATABASE_URL",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function guardarPack(packData) {
  const id = Date.now();
  db.ref("packs/" + id).set(packData)
    .then(() => {
      alert("✅ Pack subido correctamente!");
      window.location.href = "index.html";
    })
    .catch(err => alert("❌ Error: " + err.message));
}

function cargarPacks() {
  const contenedor = document.querySelector(".packs");
  if (!contenedor) return;
  contenedor.innerHTML = "<p>Cargando packs...</p>";

  db.ref("packs").once("value").then(snapshot => {
    const packs = snapshot.val() || {};
    contenedor.innerHTML = "";
    for (const id in packs) {
      const pack = packs[id];
      const div = document.createElement("div");
      div.className = "pack";
      div.innerHTML = `
        <img src="${pack.imagen}" alt="${pack.nombre}">
        <h3>${pack.nombre}</h3>
        <p>• By ${pack.autor} •</p>
        <a href="detalle.html?id=${id}" class="download-btn">Ver detalle</a>
      `;
      contenedor.appendChild(div);
    }
    if (Object.keys(packs).length === 0)
      contenedor.innerHTML = "<p style='text-align:center;color:#777;'>No hay packs aún.</p>";

    const search = document.getElementById("search");
    if (search) {
      search.addEventListener("input", e => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll(".pack").forEach(div => {
          const text = div.innerText.toLowerCase();
          div.style.display = text.includes(term) ? "" : "none";
        });
      });
    }
  });
}

function mostrarPackIndividual() {
  const id = new URLSearchParams(window.location.search).get("id");
  const cont = document.getElementById("descarga-info");
  if (!id || !cont) return;
  db.ref("packs/" + id).once("value").then(snapshot => {
    const pack = snapshot.val();
    if (!pack) {
      cont.innerHTML = "<p>No se encontró el pack.</p>";
      return;
    }
    cont.innerHTML = `
      <h2>${pack.nombre}</h2>
      <img src="${pack.imagen}" alt="${pack.nombre}" style="width:200px;border-radius:10px;margin:20px 0;">
      <p><strong>Autor:</strong> ${pack.autor}</p>
      <p><strong>Descripción:</strong> ${pack.descripcion}</p>
      <a href="${pack.archivo}" download class="download-btn">Descargar</a><br><br>
      <a href="${pack.youtube}" target="_blank" style="color:#00aaff;">Canal del creador</a>
    `;

    const likeBtn = document.createElement("button");
    likeBtn.className = "download-btn";
    likeBtn.style.backgroundColor = "#00aaff";
    likeBtn.textContent = `❤️ ${pack.likes || 0}`;
    likeBtn.addEventListener("click", () => {
      const newLikes = (pack.likes || 0) + 1;
      db.ref("packs/" + id + "/likes").set(newLikes);
      likeBtn.textContent = `❤️ ${newLikes}`;
    });
    cont.appendChild(likeBtn);
  });
}

function configurarSubida() {
  const subirBtn = document.getElementById("upload-confirm");
  if (!subirBtn) return;
  subirBtn.addEventListener("click", () => {
    const nombre = document.getElementById("pack-name").value.trim();
    const autor = document.getElementById("pack-author").value.trim();
    const descripcion = document.getElementById("pack-desc").value.trim();
    const imagen = document.getElementById("pack-img").value.trim();
    const archivo = document.getElementById("pack-file").value.trim();
    const youtube = document.getElementById("pack-yt").value.trim();

    if (!nombre || !autor || !descripcion || !imagen || !archivo) {
      alert("⚠️ Rellena todos los campos antes de subir.");
      return;
    }

    if (!imagen.startsWith("http") || !archivo.startsWith("http")) {
      alert("❌ URLs inválidas para imagen o archivo.");
      return;
    }

    const packData = { nombre, autor, descripcion, imagen, archivo, youtube, likes: 0 };
    guardarPack(packData);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".packs")) cargarPacks();
  if (document.getElementById("upload-confirm")) configurarSubida();
  if (document.getElementById("descarga-info")) mostrarPackIndividual();
});
