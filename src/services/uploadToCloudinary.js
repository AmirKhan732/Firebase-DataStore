import {
  CLOUDINARY_UPLOAD_URL,
  CLOUDINARY_UPLOAD_PRESET,
} from "./cloudinaryConfig.js";

function guessMime(uri) {
  const ext = uri?.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

export async function uploadToCloudinary(uri, folder = "items") {
  const form = new FormData();
  form.append("file", {
    uri,
    name: `item_${Date.now()}`,
    type: guessMime(uri),
  });
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  form.append("folder", folder);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${txt}`);
  }
  return await res.json();
}
