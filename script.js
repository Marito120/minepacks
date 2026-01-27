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