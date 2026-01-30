const firebaseConfig = {
  apiKey: "AIzaSyBalJE5deMcq6iOpOvLp4yjK0jbIqaLNjs",
  authDomain: "texturepacks-marulys.firebaseapp.com",
  databaseURL: "https://texturepacks-marulys-default-rtdb.firebaseio.com",
  projectId: "texturepacks-marulys",
  storageBucket: "texturepacks-marulys.appspot.com",
  messagingSenderId: "1039533435087",
  appId: "1:1039533435087:web:7d3a38a1bca4800ff86fba",
  measurementId: "G-S3EVXWZGKR"
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
  const imgBtn = document.getElementById("upload-img-btn");
  const zipBtn = document.getElementById("upload-zip-btn");
  const imgUrlP = document.getElementById("img-url");
  const zipUrlP = document.getElementById("zip-url");
  const status = document.getElementById("upload-status");

  let imgURL = "";
  let zipURL = "";

  const uploadOptions = {
    apiKey: "public_223k2Yf9KbzGVxh6HYTZiMjcQcf1",
    maxFileCount: 1
  };

  imgBtn.addEventListener("click", () => {
    Bytescale.UploadWidget.open(uploadOptions).then(files => {
      if (files.length > 0) {
        imgURL = files[0].fileUrl;
        imgUrlP.textContent = imgURL;
      }
    });
  });

  zipBtn.addEventListener("click", () => {
    Bytescale.UploadWidget.open(uploadOptions).then(files => {
      if (files.length > 0) {
        zipURL = files[0].fileUrl;
        zipUrlP.textContent = zipURL;
      }
    });
  });

  subirBtn.addEventListener("click", () => {
    const nombre = document.getElementById("pack-name").value.trim();
    const autor = document.getElementById("pack-author").value.trim();
    const descripcion = document.getElementById("pack-desc").value.trim();
    const youtube = document.getElementById("pack-yt").value.trim();

    if (!nombre || !autor || !descripcion || !imgURL || !zipURL) {
      alert("⚠️ Completa todos los campos y sube los archivos.");
      return;
    }

    status.textContent = "Guardando pack...";
    const packData = { nombre, autor, descripcion, imagen: imgURL, archivo: zipURL, youtube, likes: 0 };
    guardarPack(packData);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".packs")) cargarPacks();
  if (document.getElementById("upload-confirm")) configurarSubida();
  if (document.getElementById("descarga-info")) mostrarPackIndividual();
});
