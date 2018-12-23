const mongoose = require('mongoose');

const characterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type : String, required: true},
    level: {type:Number, required: false, default:0},
    class: {type: String, required: true }
});

module.exports = mongoose.model('Character',characterSchema);