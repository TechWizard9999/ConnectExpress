const express = require('express');
const router = express.Router();
const {
  createTrain,
  getAllTrains,
} = require('../controllers/trainController');

router.post('/create', createTrain);
router.get('/', getAllTrains);

module.exports = router;