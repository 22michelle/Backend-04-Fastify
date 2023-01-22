import postCtrl from "../controllers/post.controller.js";
import { authClient } from "../middleware/auth.js";
import { upload } from "../middleware/imgUpload.js";
import { postValidSchema } from "../ValidSchemas/postValid.js";

const middleware = (req, reply, done) => {
  authClient(req, reply, done);
};

export const postRoutes = (fastify, opts, done) => {
  fastify.get("/", { preHandler: [middleware] }, postCtrl.list);
  fastify.get("/:id", { preHandler: [middleware] }, postCtrl.listOne);
  fastify.delete("/:id", { preHandler: [middleware] },postCtrl.delete);
  fastify.put(
    "/:id",
    {
      schema: postValidSchema,
      preValidation: [middleware, upload.single("img")],
    },
    postCtrl.update
  );
  fastify.post(
    "/",
    {
      schema: postValidSchema,
      preValidation: [middleware, upload.single("img")],
    },
    postCtrl.add
  );

  done();
};
