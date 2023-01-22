import {
  deleteImageCloudinary,
  uploadImageToCloudinary,
} from "../helpers/cloudinary.action.js";
import { deleteImg } from "../helpers/deleteImg.js"
import { response } from "../helpers/Response.js";
import { postModel } from "../models/post.model.js";

const postCtrl = {};

postCtrl.list = async (req, reply) => {
  try {
    const posts = await postModel.find().populate({path: "user", select: "-password"}).sort({createdAt: -1});
    response(reply, 200, true, post, "Lista de Posts");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

postCtrl.getPostsLogin = async (req, reply) => {
  try {
    const post = await postModel
      .find({ user: req.userId })
      .populate("user", { password: 0 })
      .sort({createdAt: -1});
    response(reply, 200, true, post, "Lista de Posts del usuario logueado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

postCtrl.listOne = async (req, reply) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    if (!post) {
      return response(reply, 404, false, "", "Registro no Encontrado");
    }

    response(reply, 200, true, post, "Registro Encontrado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

postCtrl.add = async (req, reply) => {
  try {
    const { title, description } = req.body;
    
    const newPost = new postModel({
      title,
      description,
      user: req.userId,
    });

    // req.file && newPost.setImg(req.file.filename);

    if (req.file) {
      const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
      newPost.setImg({ secure_url, public_id });
    }
    await postModel.create(newPost);
    response(reply, 201, true, newPost, "Post Creado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

postCtrl.delete = async (req, reply) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    if (!post) {
      return response(reply, 404, false, "", "Registro no Encontrado");
    }

    if (post.public_id) {
      await deleteImageCloudinary(post.public_id);
    }
    // post.nameImage && deleteImage(post.nameImage);

    await post.deleteOne();
    response(reply, 200, true, "", "Registro Eliminado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

postCtrl.update = async (req, reply) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    if (!post) {
      return response(reply, 404, false, "", "Registro Enocntrado");
    }

    if (req.file) {
      // post.nameImage && deleteImage(post.nameImage);
      // post.setImg(req.file.filename)

      if (post.public_id) {
        await deleteImageCloudinary(post.public_id);
      }

      const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
      post.setImg({ secure_url, public_id });

      await post.save();
    }
    await post.updateOne(req.body);
    response(reply, 200, true, "", "Registro Actualizado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

export default postCtrl;
