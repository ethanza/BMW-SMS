const express = require('express');
const sendSMSController = require('./sendSms');
const upload = require('../middelware/fileUpload');
const routes = express.Router({
    mergeParams: true
});

routes.get('/health', (req, res) => {
    res.status(200).json({ message: 'server responded' });
});

routes.post('/api/upload', upload.single('file'), sendSMSController.upload);

module.exports = {
    routes
}