let mongoose = require("mongoose");

//SCHEMA SETUP
let artistSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    youtube: String,
    spotify: String,
    facebook: String,
    twitter: String,
    instagram: String,
    pinterest: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],

}, {
    usePushEach: true
});

module.exports = mongoose.model("Artist", artistSchema);