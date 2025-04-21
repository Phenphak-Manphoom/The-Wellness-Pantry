import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "backend/config/config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload_file = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        resource_type: "auto", // รองรับ image, video, pdf ฯลฯ
        folder,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.public_id || !result?.secure_url) {
          return reject(new Error("Upload failed: Incomplete result"));
        }

        resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    );
  });
};

export const delete_file = async (public_id, resource_type = "image") => {
  try {
    const res = await cloudinary.v2.uploader.destroy(public_id, {
      resource_type,
    });

    return res?.result === "ok";
  } catch (error) {
    console.error("Failed to delete file from Cloudinary:", error);
    return false;
  }
};
