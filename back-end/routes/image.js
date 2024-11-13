const express = require('express');
const uploader = require("../config/multer");
const router= express.Router();
const {upload, deleteImage} = require('../controllers/imageController')


router.post('/upload', uploader.array('files') ,upload);
router.put('/delete', deleteImage)

module.exports = router;