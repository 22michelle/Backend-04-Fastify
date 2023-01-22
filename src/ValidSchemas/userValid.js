export const userValidSchema = {
  body: {
    type: "object",
    required: ["name", "password", "email"],
    properties: {
      name: {
        type: "string",
      },
      password: {
        type: "string",
        minLength: 4,
      },
      email: {
        type: "string",
        format: "email",
      },
    },
  },
};
