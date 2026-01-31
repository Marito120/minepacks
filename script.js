function configurarSubida() {
  const imgBtn = document.getElementById("upload-img-btn");
  const zipBtn = document.getElementById("upload-zip-btn");
  const subirBtn = document.getElementById("upload-confirm");
  const imgUrlP = document.getElementById("img-url");
  const zipUrlP = document.getElementById("zip-url");
  const status = document.getElementById("upload-status");

  let imgURL = "";
  let zipURL = "";

  // Upload.io (solo imágenes)
  const uploadOptions = {
    apiKey: "public_223k2Yf9KbzGVxh6HYTZiMjcQcf1",
    maxFileCount: 1,
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"]
  };

  // Subir imagen (Upload.io)
  imgBtn.addEventListener("click", () => {
    Bytescale.UploadWidget.open(uploadOptions).then(files => {
      if (files.length > 0) {
        imgURL = files[0].fileUrl;
        imgUrlP.textContent = imgURL;
      }
    });
  });

  // Subir ZIP (Transfer.sh)
  zipBtn.addEventListener("click", async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip,.rar,.7z";
    input.click();

    input.addEventListener("change", async () => {
      const file = input.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);

      status.textContent = "⏳ Subiendo archivo ZIP...";
      try {
        const res = await fetch(`https://transfer.sh/${file.name}`, {
          method: "PUT",
          body: file
        });
        const link = await res.text();
        if (link.startsWith("https://")) {
          zipURL = link.trim();
          zipUrlP.textContent = zipURL;
          status.textContent = "✅ ZIP subido correctamente";
        } else {
          throw new Error("No se recibió enlace válido");
        }
      } catch (err) {
        console.error(err);
        status.textContent = "❌ Error al subir el ZIP";
      }
    });
  });

  // Confirmar datos
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
    status.textContent = "✅ Pack preparado (guarda las URLs o añádelas manualmente a tu web)";
    alert(info);
    console.log(info);
  });
}

document.addEventListener("DOMContentLoaded", () => {

