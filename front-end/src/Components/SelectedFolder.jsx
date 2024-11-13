import React, { useContext, useState } from 'react';
import { userContext } from '../Context/UserContext';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for styling
import { ClipLoader } from 'react-spinners'; // Import the spinner

export default function SelectedFolder() {
    const { selectedFolder, setSelectedFolder, setFolders} = useContext(userContext);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // New state for upload status
    const [isDeleting, setIsDeleting] = useState(false); // New state for delete status
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); // State for delete confirmation dialog
    const [imageToDelete, setImageToDelete] = useState(null); // Store the image to delete

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setImages(files)
        setImagePreviews(imageUrls);
        setShowDialog(true);
    };

    const handleFileInputChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) {
            return;
        }
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setImagePreviews(imageUrls);
        setImages(files); // Store files for later upload
        setShowDialog(true); // Show dialog after setting images
    };

    const confirmUpload = async () => {
        if (images.length === 0) return; // Ensure there are images to upload
        console.log(images);

        if(selectedFolder.images.length+images.length>300){
            setImages([]); // Clear images after upload
            setImagePreviews([]);
            setShowDialog(false);
            return ;
        }
        
        // Create FormData to send files
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('files', image); // Append each file to the FormData
        });
        formData.append('folderId', selectedFolder._id); // Append folderId

        setShowDialog(false); // Close dialog before starting upload
        setIsUploading(true); // Set uploading state to true

        try {
            const response = await axios.post('http://localhost:4000/image/upload', formData, 
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data', // Set content type for form data
                },
            });
            setSelectedFolder(response.data); // Handle success
            setImages([]); // Clear images after upload
            setImagePreviews([]); // Clear previews
            
            // Update the folder in the folders state
            setFolders(prevFolders => 
                prevFolders.map(folder => 
                    folder._id === selectedFolder._id ? response.data : folder
                )
            );
            toast.success('Upload successful!'); // Show success message
        } catch (error) {
            console.error('Error uploading images:', error.response ? error.response.data : error.message);
            toast.error('Error uploading images. Please try again.'); // Show error message
        } finally {
            setIsUploading(false); // Reset uploading state
        }
    };

    const cancelUpload = () => {
        setImagePreviews([]);
        setShowDialog(false);
    };

    const handleDeleteConfirmation = (image) => {
        setImageToDelete(image); // Set the image to delete
        setShowDeleteDialog(true); // Show the delete confirmation dialog
    };

    const confirmDelete = async () => {
        setIsDeleting(true); // Set deleting state to true
        setShowDeleteDialog(false); // Close the confirmation dialog
        try {
            const response = await axios.put('http://localhost:4000/image/delete', {
                folderId: selectedFolder._id,
                url: imageToDelete
            }, 
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setSelectedFolder(response.data); // Handle success
            setFolders(prevFolders => 
                prevFolders.map(folder => 
                    folder._id === selectedFolder._id ? response.data : folder
                )
            );
            toast.success('Image deleted successfully!'); // Show success message
        } catch (error) {
            console.error('Error deleting image:', error.response ? error.response.data : error.message);
            toast.error('Error deleting image. Please try again.'); // Show error message
        } finally {
            setIsDeleting(false); // Reset deleting state
            setImageToDelete(null); // Clear the image to delete
        }
    };

    const handleShare = (image) => {
        alert(`Share link for ${image}`);
    };

    const handleDownload = (image) => {
        const a = document.createElement('a');
        a.href = image;
        a.download = 'image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <>
            {isUploading && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"> {/* Full-screen overlay */}
                    <ClipLoader color="#36D7B7" loading={isUploading} size={50} /> {/* Spinner */}
                    <span className="ml-2 text-white">Uploading...</span> {/* Uploading message */}
                </div>
            )}
            {isDeleting && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"> {/* Full-screen overlay */}
                    <ClipLoader color="#36D7B7" loading={isDeleting} size={50} /> {/* Spinner */}
                    <span className="ml-2 text-white">Deleting...</span> {/* Deleting message */}
                </div>
            )}
            {showDeleteDialog && (
                <dialog className="modal modal-bottom sm:modal-middle" open>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm Image Deletion</h3>
                        <p>Are you sure you want to delete this image?</p>
                        <div className="modal-action">
                            <button className="btn btn-success" onClick={confirmDelete}>Yes, Delete</button>
                            <button className="btn btn-error" onClick={() => setShowDeleteDialog(false)}>Cancel</button>
                        </div>
                    </div>
                </dialog>
            )}
            {selectedFolder ? (
                <div className="overflow-y-auto no-scrollbar w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 space-y-4 sm:space-y-0">
                        <h2 className="text-2xl font-bold text-center sm:text-left">{selectedFolder.folderName}</h2>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileInputChange}
                            className="file-input file-input-bordered w-full sm:w-auto max-w-xs"
                        />
                    </div>


                    {selectedFolder.images.length > 0 ? (
                        <div className="flex flex-wrap gap-4 p-4 justify-center" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                            {selectedFolder.images.map((image, index) => (
                                <div key={index} className="relative w-80 h-auto bg-gray-200 rounded shadow-md group">
                                    <img src={image} alt="Uploaded" className="w-full h-full object-cover rounded" />
                                    <div className="absolute bottom-2 left-2 right-2 flex justify-around opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 p-2 rounded">
                                        <DeleteIcon
                                            onClick={() => handleDeleteConfirmation(image)} // Call confirmation on delete
                                            className="cursor-pointer text-white hover:text-red-600 transition"
                                            sx={{ fontSize: 24 }}
                                        />
                                        <ShareIcon
                                            onClick={() => handleShare(image)}
                                            className="cursor-pointer text-white hover:text-blue-600 transition"
                                            sx={{ fontSize: 24 }}
                                        />
                                        <DownloadIcon
                                            onClick={() => handleDownload(image)}
                                            className="cursor-pointer text-white hover:text-green-600 transition"
                                            sx={{ fontSize: 24 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center p-4 w-full">
                            <div
                                className="w-full h-[calc(100vh-200px)] flex flex-col justify-center items-center border-2 border-dashed border-gray-400 rounded-lg p-4"
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <p>Drag and drop images here to upload</p>
                            </div>
                        </div>
                    )}

                    {showDialog && (
                        <dialog className="modal modal-bottom sm:modal-middle" open>
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Confirm Image Upload</h3>
                                <p>Are you sure you want to upload the selected images?</p>
                                <div className="flex flex-wrap gap-4 p-4">
                                    {imagePreviews.map((image, index) => (
                                        <div key={index} className="w-full h-64 bg-gray-200 rounded shadow-md">
                                            <img src={image} alt="Preview" className="w-full h-full object-cover rounded" />
                                        </div>
                                    ))}
                                </div>
                                <div className="modal-action">
                                    <button className="btn btn-success" onClick={confirmUpload}>Upload</button>
                                    <button className="btn btn-error" onClick={cancelUpload}>Cancel</button>
                                </div>
                            </div>
                        </dialog>
                    )}
                </div>
            ) : (
                <div className="h-full w-full flex justify-center items-center">
                    <div className='text-center'>Create a folder to upload images or select a folder to view images</div>
                </div>
            )}
        </>
    );
}
