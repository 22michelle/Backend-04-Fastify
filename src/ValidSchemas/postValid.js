export const postValidSchema = {
  body: {
    type: "object",
    required: ["title", "description"],
    properties: {
      title: {
        type: "string",
        minLength: 5,
      },
      description: {
        type: "string",
        minLength: 10,
      },
    },
  },
};
