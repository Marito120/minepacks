const SUPABASE_URL = "https://tkqukzqwhciycdfmitzp.supabase.co";
const SUPABASE_KEY = "sb_publishable_3lqIlhhgmwLT85e0Szp-AQ_7oMyhdg1";
const BUCKET_NAME = "texture packs";

async function subirArchivo(file) {
  const filePath = `${Date.now()}-${file.name}`;
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${filePath}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": file.type
    },
    body: file
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error al subir archivo: ${error}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filePath}`;
}

function configurarSubida() {
  const imgBtn = document.getElementById("upload-img-btn");
  const zipBtn = document.getElementById("upload-zip-btn");
  const subirBtn = document.getElementById("upload-confirm");
  const imgUrlP = document.getElementById("img-url");
  const zipUrlP = document.getElementById("zip-url");
  const status = document.getElementById("upload-status");
  let imgURL = "";
  let zipURL = "";

  async function seleccionarYSubir(tipo) {
    const input = document.createElement("input");
    input.type = "file";
    if (tipo === "imagen") input.accept = "image/png,image/jpeg,image/webp,image/gif";
    else input.accept = ".zip,.rar,.7z";
    input.click();
    input.addEventListener("change", async () => {
      const file = input.files[0];
      if (!file) return;
      status.textContent = `⏳ Subiendo ${file.name}...`;
      try {
        const link = await subirArchivo(file);
        if (tipo === "imagen") {
          imgURL = link;
          imgUrlP.textContent = imgURL;
        } else {
          zipURL = link;
          zipUrlP.textContent = zipURL;
        }
        status.textContent = `✅ ${file.name} subido correctamente`;
      } catch (err) {
        console.error(err);
        status.textContent = `❌ Error al subir ${file.name}`;
      }
    });
  }

  imgBtn.addEventListener("click", () => seleccionarYSubir("imagen"));
  zipBtn.addEventListener("click", () => seleccionarYSubir("zip"));

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

function cargarPacks() {
  const contenedor = document.getElementById("packs-list");
  if (!contenedor) return;
  contenedor.innerHTML = "<p>Cargando packs...</p>";
  contenedor.innerHTML = "<p style='text-align:center;color:#777;'>Por ahora los packs deben añadirse manualmente usando las URLs generadas.</p>";
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("upload-confirm")) configurarSubida();
  if (document.getElementById("packs-list")) cargarPacks();
});
