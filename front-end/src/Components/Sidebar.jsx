import CreateFolder from "./CreateFolder";
import Folderlist from "./Folderlist";


export default function Sidebar({setOpen}) {
    const handleClickOpen = () => {
        setOpen(true);
    };
    return (
        <div className="overflow-y-auto">
            <CreateFolder handleClickOpen={handleClickOpen}/>
            <div className="divider mt-0 mb-0" />
            <Folderlist/>
        </div>
    )
}