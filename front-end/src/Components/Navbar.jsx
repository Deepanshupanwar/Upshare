import { useContext } from "react";
import CreateFolder from "./CreateFolder";
import Folderlist from "./Folderlist";
import { userContext } from "../Context/UserContext";
import { Avatar } from "@mui/material";

export default function Navbar({setOpen}) {
    const {userInfo, setUserInfo} = useContext(userContext);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleLogout = () => {
        setUserInfo(null);
        document.cookie = "jwthello=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    return (
        <div className="flex items-center p-2 w-full h-[60px] sticky top-0 bg-base-100 border-b border-gray-500 z-50">
            <div className="flex-1">
                <div className="dropdown">
                    <div tabIndex="0" role="button" className="btn btn-ghost md:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <div
                        tabIndex="0"
                        className="menu menu-sm flex flex-row justify-center dropdown-content bg-base-200 h-96 z-[1] rounded-box mt-3 w-52 p-2 shadow overflow-y-auto no-scrollbar">
                        <div className="w-full">
                            <CreateFolder handleClickOpen={handleClickOpen}/>
                            <div className="divider mt-0 mb-0"/>
                            <div className="w-full"><Folderlist/></div>
                        </div>
                    </div>
                </div>
                <a className="btn btn-ghost text-xl">UpShare</a>
            </div>
            <div className="flex-none flex items-center gap-2">
                <div className="text-sm font-semibold px-3 py-1 rounded-full">
                    {userInfo.name}
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <Avatar src={userInfo?.profile_pic}/>
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li onClick={handleLogout}><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
