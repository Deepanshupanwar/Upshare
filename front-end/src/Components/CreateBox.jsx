import { useContext, useState } from "react";
import { userContext } from "../Context/UserContext";
import axios from 'axios';

export default function CreateBox({ open, setOpen }) {
    const [folderName, setFolderName] = useState('');
    const [error, setError] = useState('');
    const { folders, setFolders } = useContext(userContext);

    const handleInputChange = (e) => {
        setFolderName(e.target.value);
        setError('');
    };

    const handleCreate = async () => {
        if(folders.length+1>10){
            setError('Cannot make more folder buy premium');
        }
        else if (folderName.length > 0) {
            const folderExists = folders.some(folder => folder.folderName === folderName);
            if (folderExists) {
                setError('This folder already exists');
            } else {
                try {
                    const response = await axios.post('http://localhost:4000/folder/create', {
                        folderName,
                    },
                        {
                            withCredentials: true,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                    console.log(response.data);
                    setFolders(response.data);
                    setOpen(false);
                    setFolderName('');
                    setError('');
                } catch (error) {
                    setError('Error creating folder');
                }
            }
        } else {
            setError('Please enter a folder name');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setFolderName('');
        setError('');
    };
    return (
        <>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-base-100 p-8 rounded-lg shadow-xl w-96">
                        <h3 className="font-bold text-lg mb-4">Create New Folder</h3>
                        <input
                            type="text"
                            placeholder="Folder Name"
                            className="input input-bordered w-full mb-2"
                            value={folderName}
                            onChange={handleInputChange}
                        />
                        {error && <p className="text-error text-sm mb-4">{error}</p>}
                        <div className="flex justify-end space-x-2 mt-6">
                            <button className="btn btn-ghost" onClick={handleClose}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleCreate}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}