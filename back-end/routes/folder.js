const express = require('express');
const router = express.Router();
const {createFolder, deleteFolder} = require('../controllers/folderController');

router.post('/create', createFolder);
router.delete('/delete/:folderId', deleteFolder);

module.exports = router;