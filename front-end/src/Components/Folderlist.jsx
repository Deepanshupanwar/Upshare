import { useContext, useState } from 'react';
import { userContext } from '../Context/UserContext';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for styling
import { ClipLoader } from 'react-spinners'; // Import the spinner
import ShareIcon from '@mui/icons-material/Share'; // Import Share icon
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete icon
import axios from 'axios';

export default function Folderlist() {
    const { folders, selectedFolder, setSelectedFolder, setFolders } = useContext(userContext);
    const [isDeleting, setIsDeleting] = useState(false); // State for delete status
    const [folderToDelete, setFolderToDelete] = useState(null); // Store the folder to delete
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); // State for delete confirmation dialog

    const handleDeleteConfirmation = (folder) => {
        setFolderToDelete(folder); // Set the folder to delete
        setShowDeleteDialog(true); // Show the delete confirmation dialog
    };

    const confirmDelete = async () => {
        setIsDeleting(true); // Set deleting state to true
        setShowDeleteDialog(false); // Close the confirmation dialog
        console.log(folderToDelete)
        try {
            // Assuming you have an API endpoint to delete the folder
            const response = await axios.delete(`http://localhost:4000/folder/delete/${folderToDelete._id}`, {
                withCredentials: true,
            });
            setFolders(prevFolders => prevFolders.filter(folder => folder._id !== folderToDelete._id)); // Update folders state
            if(selectedFolder!=null && selectedFolder._id == folderToDelete._id){
                setSelectedFolder(null)
            }
            toast.success('Folder deleted successfully!'); // Show success message
        } catch (error) {
            console.error('Error deleting folder:', error.response ? error.response.data : error.message);
            toast.error('Error deleting folder. Please try again.'); // Show error message
        } finally {
            setIsDeleting(false); // Reset deleting state
            setFolderToDelete(null); // Clear the folder to delete
        }
    };

    const handleShare = (folder) => {
        // Implement your share logic here
        // For example, you could copy the folder link to the clipboard
        navigator.clipboard.writeText(`http://yourapp.com/folder/${folder._id}`);
        toast.success('Folder link copied to clipboard!'); // Show success message
    };

    return (
        <>
            {isDeleting && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"> {/* Full-screen overlay */}
                    <ClipLoader color="#36D7B7" loading={isDeleting} size={50} /> {/* Spinner */}
                    <span className="ml-2 text-white">Deleting...</span> {/* Deleting message */}
                </div>
            )}
            {showDeleteDialog && (
                <dialog className="modal modal-bottom sm:modal-middle" open>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm Folder Deletion</h3>
                        <p>Are you sure you want to delete this folder?</p>
                        <div className="modal-action">
                            <button className="btn btn-success" onClick={confirmDelete}>Yes, Delete</button>
                            <button className="btn btn-error" onClick={() => setShowDeleteDialog(false)}>Cancel</button>
                        </div>
                    </div>
                </dialog>
            )}
            <div className="mt-2 mb-2">
                <ul className="overflow-y-auto px-2">
                    {folders.map((folder) => (
                        <div key={folder._id} className={`py-1 pl-2 flex flex-row justify-between items-center rounded-lg transition-colors duration-200 ${selectedFolder === folder ? 'bg-primary text-primary-content' : 'hover:bg-base-300 text-base-content'}`}> {/* Outer div for selection and highlight */}
                            <div className="flex-grow text-left"> {/* Folder name container */}
                                <button
                                    className="w-full text-left px-4 py-2 rounded-lg transition-colors duration-200"
                                    onClick={() => setSelectedFolder(folder)}
                                >
                                    {folder.folderName}
                                </button>
                            </div>
                            <div className="flex space-x-2 mt-2 sm:mt-0"> {/* Icons container */}
                                <DeleteIcon
                                    onClick={() => handleDeleteConfirmation(folder)} // Delete icon
                                    className="cursor-pointer text-white hover:text-red-600 transition"
                                    sx={{ fontSize: 24 }}
                                />
                            </div>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    );
}