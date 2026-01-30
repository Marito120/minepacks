function configurarSubida() {
  const imgBtn = document.getElementById("upload-img-btn");
  const zipBtn = document.getElementById("upload-zip-btn");
  const subirBtn = document.getElementById("upload-confirm");
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

    const info = `
📦 Nombre: ${nombre}
👤 Autor: ${autor}
📝 Descripción: ${descripcion}
🎬 YouTube: ${youtube || "(no especificado)"}
🖼️ Imagen: ${imgURL}
📁 Archivo: ${zipURL}
`;
    status.textContent = "✅ Pack preparado (guarda estas URLs o añádelas manualmente a tu web)";
    alert(info);
    console.log(info);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("upload-confirm")) configurarSubida();
});

