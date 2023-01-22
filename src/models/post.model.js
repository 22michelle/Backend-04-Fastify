import mongoose from "mongoose";

const { Schema, model } = mongoose;
const postSchema = new Schema({
    title: {
        type: String,
        required: [true, "El campo Título es Obligatorio"],
    },
    description: {
        type: String,
        required: [true, "El campo Descripción es Obligatorio"],
    },
    imgUrl: {
        type: String,
        default: null,
    },
    // nameImage: {
    //     type: String,
    // },
    public_id: String,

    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
}, { timestamps: true });

// postSchema.methods.setImg = function setImg(filename) {
//     const url = `http://localhost:4000/public/`;
//     this.imgUrl = url + filename;
//     this.nameImage = filename;
// };

postSchema.methods.setImg = function setImg({ secure_url, public_id }) {
    this.imgUrl = secure_url;
    this.public_id = public_id;
};
export const postModel = model("post", postSchema);