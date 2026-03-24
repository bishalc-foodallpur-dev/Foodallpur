export const uploadImage = async (file) => {
  try {
    if (!file) {
      console.error("❌ No file selected");
      return null;
    }

    const url = `https://api.cloudinary.com/v1_1/dawgv2iso/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "foodallpur");

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    console.log("☁️ Cloudinary FULL response:", data);

    if (data.error) {
      console.error("❌ Cloudinary error:", data.error.message);
      return null;
    }

    return data.secure_url || null;

  } catch (error) {
    console.error("❌ Upload exception:", error);
    return null;
  }
};