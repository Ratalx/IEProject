const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    scenario:{type: mongoose.Schema.Types.ObjectId, ref:"Scenario", required: true},
    playerCharacter:{type: mongoose.Schema.Types.ObjectId, ref: "Character", required: true}
});

module.exports = mongoose.model('Session',sessionSchema);