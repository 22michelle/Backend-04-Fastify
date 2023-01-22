import cloudinary from "./cloudinary.config.js";
import { deleteImg } from "./deleteImg.js";

export const uploadImageToCloudinary = async (file) => {
  try {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    deleteImg(file.filename);
    return {
      secure_url,
      public_id,
    };
  } catch (error) {
    console.log("Error en subirImageACloudinary", error.message);
  }
};

export const deleteImageCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.log("Error en eliminarImagenCloudinary", error.message);
  }
};
