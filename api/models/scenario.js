const mongoose = require('mongoose');

const scenarioSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type : String, required: true},
    dificultyLevel: Number,
    scenarioImage: {type: String, required: false}
});

module.exports = mongoose.model('Scenario',scenarioSchema);