const express = require('express')
const router = express.Router()

const {createStation} = require('../controllers/station')

router.post('/create', createStation)

module.exports = router