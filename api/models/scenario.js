const mongoose = require('mongoose');

const scenarioSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    dificultyLevel: Number
});

module.exports = mongoose.model('Scenario',scenarioSchema);