function configurarSubida() {
  const imgBtn = document.getElementById("upload-img-btn");
  const zipBtn = document.getElementById("upload-zip-btn");
  const subirBtn = document.getElementById("upload-confirm");
  const imgUrlP = document.getElementById("img-url");
  const zipUrlP = document.getElementById("zip-url");
  const status = document.getElementById("upload-status");

  let imgURL = "";
  let zipURL = "";

  // Subir imagen o ZIP a file.io
  async function subirArchivo(tipo) {
    const input = document.createElement("input");
    input.type = "file";
    if (tipo === "imagen") input.accept = "image/png,image/jpeg,image/webp,image/gif";
    else input.accept = ".zip,.rar,.7z";
    input.click();

    input.addEventListener("change", async () => {
      const file = input.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);

      status.textContent = `⏳ Subiendo ${file.name}...`;
      try {
        const res = await fetch("https://file.io", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        if (data.success && data.link) {
          if (tipo === "imagen") {
            imgURL = data.link;
            imgUrlP.textContent = imgURL;
          } else {
            zipURL = data.link;
            zipUrlP.textContent = zipURL;
          }
          status.textContent = `✅ ${file.name} subido correctamente`;
        } else {
          throw new Error("No se recibió link válido");
        }
      } catch (err) {
        console.error(err);
        status.textContent = `❌ Error al subir ${file.name}`;
      }
    });
  }

  imgBtn.addEventListener("click", () => subirArchivo("imagen"));
  zipBtn.addEventListener("click", () => subirArchivo("zip"));

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
    status.textContent = "✅ Pack preparado. Guarda las URLs o añádelas a tu web.";
    alert(info);
    console.log(info);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("upload-confirm")) configurarSubida();
});
