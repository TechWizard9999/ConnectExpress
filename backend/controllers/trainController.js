const Train = require('../models/train');

exports.createTrain = async (req, res) => {
  try {
    const train = new Train(req.body);
    await train.save();
    res.status(201).json({
      success: true,
      data: train,
      message: 'Train created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find();
    res.status(200).json({
      success: true,
      data: trains,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};