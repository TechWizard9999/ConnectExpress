const mongoose = require('mongoose')

const stationSchema = new mongoose.Schema({
    stationCode: {
        type: String,
        required: true
    },
    stationName: {
        type: String,
        required: true
    },
    distances: [{
        stationCode: {
            type: String,
            required: true
        },
        distance: {
            type: Number,
            required: true
        }
    }]
});

module.exports = mongoose.model('Station', stationSchema)