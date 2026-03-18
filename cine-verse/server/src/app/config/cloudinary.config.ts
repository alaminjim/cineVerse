import { v2 as cloudinary } from "cloudinary";
import { envConfig } from "./env";

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (
  file: Express.Multer.File,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "movie-portal" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || "");
      },
    );
    stream.end(file.buffer);
  });
};
