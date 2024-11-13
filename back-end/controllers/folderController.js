const jwt = require('jsonwebtoken');
const Folder = require('../models/Folder');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary')

exports.createFolder = async (req, res) => {
    const {folderName} = req.body;
    const token = req.cookies.jwthello;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.data;
    try {
        const folder = new Folder({
            owner: userId,
            folderName: folderName
        });
        await folder.save();
        await User.findByIdAndUpdate(userId, {
            $push: {folder: folder._id}
        }).populate('folder');
        const folder_list = await Folder.find({owner: userId});
        res.status(201).json(folder_list);
    } catch (error) {
        res.status(500).json({message: 'Failed to create folder', error});
    }
}

exports.deleteFolder = async (req, res) => {
    const { folderId } = req.params;
    const token = req.cookies.jwthello;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(folderId)
    const userId = decoded.data;
    console.log(userId);
    try {
        const folder = await Folder.findById(folderId); 
        console.log(folder)
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        if (folder.owner.toString() !== userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Delete all images in the folder from Cloudinary
        console.log(1);
        for (var i = 0; i < folder.images.length; i++) {
            console.log(1.1);
            const parts1 = folder.images[i].split('/');
            const parts2 = parts1[parts1.length - 1].split('.');
            const path = parts2[0];
            console.log(path);
            await cloudinary.v2.uploader.destroy(path, function(error, result) {
                // Handle error if needed
            });
        }
        // Remove the folder from the user's folder list
        console.log(2);
        await User.findByIdAndUpdate(userId, { $pull: { folder: folderId } });
        // Delete the folder from the database
        console.log(3);
        await Folder.findByIdAndDelete(folderId);
        console.log(4);

        res.status(200).json({message: "successs"});
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete folder', error });
    }
}


