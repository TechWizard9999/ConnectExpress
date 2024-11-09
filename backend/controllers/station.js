const Station = require('../models/station')

exports.createStation = async (req, res) => {
    try {
        const { name, stationCode, distances } = req.body.station;
        const station = new Station({
            stationName: name,
            stationCode,
            distances
        });
        
        await station.save();
        return res.json({
            success: true,
            message: "Station created successfully",
            data: station
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}