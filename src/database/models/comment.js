const { default: mongoose } = require("mongoose");


const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

module.exports = {
    CommentSchema
}