const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    comments: [{type:Schema.Types.ObjectId, ref: 'Comment'}]
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(timestamps);

module.exports = mongoose.model("User", UserSchema);