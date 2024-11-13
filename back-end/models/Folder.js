const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
    owner: {type: Object, required: true, ref: 'User'},
    folderName: {type: String, required: true},
    images: {type: Array, default: []},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Folder', FolderSchema);