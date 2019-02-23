const mongoose = require("mongoose");
const findOrCreate = require('mongoose-find-or-create');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const ApiCacheSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    data: {
        type: String
    },
    cacheTime: {
        type: Number,
        default: 0
    }
});

ApiCacheSchema.plugin(findOrCreate);
ApiCacheSchema.plugin(timestamps);

module.exports = mongoose.model('ApiCache', ApiCacheSchema);