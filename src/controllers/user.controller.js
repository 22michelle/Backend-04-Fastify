import { encryptPassword } from "../helpers/encryptPassword.js";
import { generateToken } from "../helpers/generateToken.js";
import { response } from "../helpers/Response.js";
import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";

const userCtrl = {};

userCtrl.register = async (req, reply) => {
  try {
    const { email, password, name } = req.body;
    const user = await userModel.findOne({ email });

    if (user) {
      return response(
        reply,
        409,
        false,
        "",
        "El correo ya existe en otro registro"
      );
    }

    const passwordEncrypt = encryptPassword(password);
    const newUser = new userModel({ email, password: passwordEncrypt, name });
    await newUser.save();
    const token = generateToken({ user: newUser._id });

    response(
      reply,
      201,
      true,
      { ...newUser._doc, password: null, token },
      "Usuario creado con éxito"
    );
  } catch (error) {
    response(reply, 500, false, null, error.message);
  }
};

userCtrl.login = async (req, reply) => {
  try {
    const { password, email } = req.body;
    const user = await userModel.findOne({ email });

    if (user && user.matchPassword(password)) {
      const token = generateToken({ user: user._id });
      return response(
        reply,
        200,
        true,
        { ...user.toJSON(), password: null, token },
        "Bienvenido"
      );
    }

    response(reply, 400, false, "", "Email o Password incorrectos");
  } catch (error) {
    response(reply, 500, false, null, error.message);
  }
};

export default userCtrl;
