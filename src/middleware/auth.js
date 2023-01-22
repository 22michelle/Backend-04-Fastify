import jwt from "jsonwebtoken";
import { response } from "../helpers/Response.js";
import { userModel } from "../models/user.model.js";

const messageNoAuth = (reply) => {
  return response(
    reply,
    401,
    false,
    "",
    "No estás autorizado para realizar la petición."
  );
};

export const authClient = async (req, reply, done) => {
  let token = null;

  // Capturar el valor de la autorización y SI este existe
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Separación de elementos para convertir en array y buscar por index
    token = req.headers.authorization.split(" ")[1];

    // Verificar si el token es verdadero gracias a la desencriptación por la "palabra mágica"
    jwt.verify(token, "abc123", async (error, payload) => {
      if (error) {
        return messageNoAuth(reply);
      }

      // Verificar si existe o no el usuario para impedir la entrada sin autenticación
      const user = await userModel.findById({ _id: payload.user });
      if (!user) {
        return messageNoAuth(reply);
      }

      // Capturar el ID del usuario
      req.userId = payload.user;
      done();
    });
  }

  if (!token) {
    return messageNoAuth(reply);
  }
};
