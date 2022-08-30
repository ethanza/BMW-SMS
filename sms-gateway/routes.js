const express = require('express');
const router = express.Router();
const upload = require('./middelware/fileUpload');
const sendSMSController = require('./controllers/send_sms');

// router.get('/sendSMS', sendSMSController.test);
router.post('/api/test', upload.single('file'), sendSMSController.test2);

module.exports = router;