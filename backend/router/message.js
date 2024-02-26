const express = require('express');
const router = express.Router();
const { createMessage } = require('../controllers/message');

router.post('/', createMessage);


module.exports = router;
