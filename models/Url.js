const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema({
    origin: {
        type: String,
        unique: true,
        required: true,
    },
    shortUrl: {
        type: String,
        unique: true,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true,
    }
});

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;