const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/', controller.getContact);
router.post('/', controller.postContact);


module.exports = router;