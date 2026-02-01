// 🟢 CONFIGURACIÓN SUPABASE
const SUPABASE_URL = "https://tkqukzqwhciycdfmitzp.supabase.co";
const SUPABASE_KEY = "sb_publishable_3lqIlhhgmwLT85e0Szp-AQ_7oMyhdg1";
const BUCKET_NAME = "packs";

// 🚀 Subir archivo a Supabase Storage
async function subirArchivo(file) {
  const filePath = `${Date.now()}-${file.name}`;
  const res = await fetch(`${SUPABASE_URL}storage/v1/object/${BUCKET_NAME}/${filePath}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": file.type
    },
    body: file
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al subir: ${errorText}`);
  }

  // Devuelve la URL pública del archivo
  return `${SUPABASE_URL}storage/v1/object/public/${BUCKET_NAME}/${filePath}`;
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

  // Función para seleccionar archivo y subirlo
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

document.addEventListener("DOMContentLoaded", configurarSubida);
