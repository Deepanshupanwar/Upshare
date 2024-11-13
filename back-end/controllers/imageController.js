const jwt = require('jsonwebtoken');
const Folder = require('../models/Folder');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary')

exports.upload = async (req, res) => {
    try {
        const token = req.cookies.jwthello; // Change from req.cookie to req.cookies
        const check = jwt.verify(token, process.env.JWT_SECRET);
        if (!check.data) {
            return res.status(401).json({ message: "invalid auth" });
        }
        
        const { folderId } = req.body;
        for (let i = 0; i < req.files.length; i++) {
            let filepath = req.files[i].path;
            const upload = await cloudinary.v2.uploader.upload(filepath);
            // Update the folder with the uploaded image URL
            await Folder.findByIdAndUpdate(folderId, { $push: { images: upload.secure_url } });
        }
        const folder = await Folder.findById(folderId);
        res.status(200).json(folder);
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).json({ message: "error" });
    }
};


exports.deleteImage = async (req,res)=> {
    try {
        const token = req.cookies.jwthello;
        const check = jwt.verify(token, process.env.JWT_SECRET);
        if (!check.data) {
            return res.status(401).json({ message: "invalid auth" });
        }
        const { folderId, url } = req.body;
        const parts1 = url.split('/');
        const parts2 = parts1[parts1.length - 1].split('.');
        const path = parts2[0];
        // Delete the image from Cloudinary
        await cloudinary.v2.uploader.destroy(path, function(error, result) {
            // Handle error if needed
        });

        // Remove the image URL from the folder's images array
        await Folder.findByIdAndUpdate(folderId, { $pull: { images: url } }); // {{ edit_1 }}
        const updatedFolder = await Folder.findById(folderId);
        res.status(200).json(updatedFolder);

    } catch (e) {
        res.status(500).json({ message: "error" });
    }
}