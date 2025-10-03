const { default: mongoose } = require("mongoose");
const { CommentSchema } = require("./comment");


const ArticleSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    comments: {
        type: [CommentSchema],
        required: false
    }
},{
    timestamps: true
});

const ArticleModel = mongoose.model("Article", ArticleSchema);

module.exports = {
    ArticleSchema, ArticleModel
}