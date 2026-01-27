document.addEventListener("DOMContentLoaded", () => {
  // Cargar packs guardados o usar el de ejemplo
  const stored = localStorage.getItem("packs_publicados");

  const savePacks = () => localStorage.setItem("packs_publicados", JSON.stringify(packs));

  const renderPacks = () => {
    const cont = document.getElementById("packs-list");
    if (!cont) return;
    cont.innerHTML = "";
    Object.entries(packs).forEach(([id, p]) => {
      const div = document.createElement("div");
      div.className = "pack";
      div.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>• By ${p.autor} •</p>
        <a href="descarga.html?id=${id}" class="download-btn">Descargar</a>
      `;
      cont.appendChild(div);
    });
  };

  renderPacks(); // Mostrar packs

  const subirBtn = document.getElementById("upload-confirm");
  if (subirBtn) {
    subirBtn.addEventListener("click", () => {
      const name = document.getElementById("pack-name").value.trim();
      const author = document.getElementById("pack-author").value.trim();
      const desc = document.getElementById("pack-desc").value.trim();
      const yt = document.getElementById("pack-youtube").value.trim();
      const imgFile = document.getElementById("pack-img").files[0];
      const zipFile = document.getElementById("pack-file").files[0];

      if (!name || !author || !desc || !yt || !imgFile || !zipFile) {
        alert("Completa todos los campos antes de subir.");
        return;
      }

      const readerImg = new FileReader();
      const readerZip = new FileReader();

      readerImg.onload = eImg => {
        readerZip.onload = eZip => {
          const id = name.toLowerCase().replace(/\s+/g, "-");
          packs[id] = {
            nombre: name,
            autor: author,
            descripcion: desc,
            youtube: yt,
            imagen: eImg.target.result,
            archivo: eZip.target.result,
            filename: zipFile.name
          };
          savePacks();
          renderPacks();
          alert(`✅ Pack "${name}" publicado correctamente.`);
          document.getElementById("upload-form").reset();
        };
        readerZip.readAsDataURL(zipFile);
      };
      readerImg.readAsDataURL(imgFile);
    });
  }

});
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBalJE5deMcq6iOpOvLp4yjK0jbIqaLNjs",
    authDomain: "texturepacks-marulys.firebaseapp.com",
    projectId: "texturepacks-marulys",
    storageBucket: "texturepacks-marulys.firebasestorage.app",
    messagingSenderId: "1039533435087",
    appId: "1:1039533435087:web:a4c56123aa2482fff86fba",
    measurementId: "G-RYXDC8BB01"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
