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
const storage = firebase.storage();

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
  const relatedCont = document.getElementById("related-packs");
  if (!id || !cont) return;

  db.ref("packs/" + id).once("value").then(snapshot => {
    const pack = snapshot.val();
    if (!pack) {
      cont.innerHTML = "<p>No se encontró el pack.</p>";
      return;
    }

    cont.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <img src="${pack.imagen}" alt="${pack.nombre}" style="width:300px;border-radius:10px;margin:20px 0;">
        <h2>${pack.nombre}</h2>
        <p><strong>Autor:</strong> ${pack.autor}</p>
        <p><strong>Descripción:</strong> ${pack.descripcion}</p>
        <div style="margin:15px 0;">
          <a href="${pack.archivo}" download class="download-btn">Descargar</a>
          <a href="${pack.youtube}" target="_blank" class="download-btn" style="background-color:#00aaff;margin-left:10px;">Canal del creador</a>
        </div>
      </div>
    `;

    const likeBtn = document.createElement("button");
    likeBtn.className = "download-btn";
    likeBtn.style.backgroundColor = "#ff4081";
    likeBtn.textContent = `❤️ ${pack.likes || 0}`;
    likeBtn.addEventListener("click", () => {
      const newLikes = (pack.likes || 0) + 1;
      db.ref("packs/" + id + "/likes").set(newLikes);
      likeBtn.textContent = `❤️ ${newLikes}`;
    });
    cont.appendChild(likeBtn);

    if (relatedCont) {
      db.ref("packs").once("value").then(snap => {
        const allPacks = snap.val() || {};
        relatedCont.innerHTML = "";
        for (const otherId in allPacks) {
          if (otherId === id) continue;
          const otherPack = allPacks[otherId];
          if (otherPack.autor === pack.autor) {
            const div = document.createElement("div");
            div.className = "pack";
            div.innerHTML = `
              <img src="${otherPack.imagen}" alt="${otherPack.nombre}">
              <h3>${otherPack.nombre}</h3>
              <p>• By ${otherPack.autor} •</p>
              <a href="detalle.html?id=${otherId}" class="download-btn">Ver detalle</a>
            `;
            relatedCont.appendChild(div);
          }
        }
        if (!relatedCont.hasChildNodes()) {
          relatedCont.innerHTML = "<p style='text-align:center;color:#777;'>No hay packs relacionados.</p>";
        }
      });
    }
  });
}

function configurarSubida() {
  const subirBtn = document.getElementById("upload-confirm");
  const status = document.getElementById("upload-status");
  if (!subirBtn) return;

  subirBtn.addEventListener("click", () => {
    const nombre = document.getElementById("pack-name").value.trim();
    const autor = document.getElementById("pack-author").value.trim();
    const descripcion = document.getElementById("pack-desc").value.trim();
    const youtube = document.getElementById("pack-yt").value.trim();

    const imgFile = document.getElementById("pack-img-file").files[0];
    const zipFile = document.getElementById("pack-zip-file").files[0];

    if (!nombre || !autor || !descripcion || !imgFile || !zipFile) {
      alert("⚠️ Rellena todos los campos y selecciona archivos.");
      return;
    }

    status.textContent = "Subiendo imagen...";
    const imgRef = storage.ref("packs/images/" + Date.now() + "_" + imgFile.name);
    imgRef.put(imgFile).then(snapshot => snapshot.ref.getDownloadURL()).then(imgURL => {

      status.textContent = "Subiendo archivo...";
      const zipRef = storage.ref("packs/files/" + Date.now() + "_" + zipFile.name);
      zipRef.put(zipFile).then(snap => snap.ref.getDownloadURL()).then(zipURL => {

        const packData = { nombre, autor, descripcion, imagen: imgURL, archivo: zipURL, youtube, likes: 0 };
        guardarPack(packData);

      }).catch(err => alert("❌ Error subiendo archivo: " + err.message));

    }).catch(err => alert("❌ Error subiendo imagen: " + err.message));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".packs")) cargarPacks();
  if (document.getElementById("upload-confirm")) configurarSubida();
  if (document.getElementById("descarga-info")) mostrarPackIndividual();
});
