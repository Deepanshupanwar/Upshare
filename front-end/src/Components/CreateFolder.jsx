import AddIcon from '@mui/icons-material/Add';

export default function CreateFolder({handleClickOpen}) {


    return (
        <div className="flex justify-center mt-2">
            <button 
                className="btn w-full h-auto btn-ghost normal-case text-base-content hover:bg-base-300 transition-colors duration-200"
                onClick={handleClickOpen}
            >
                Create Folder <AddIcon/>
            </button>            
        </div>
    );
}