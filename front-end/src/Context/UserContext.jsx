import { createContext, useState } from "react";

export const userContext = createContext({});

export function UserContextProvider({children}){
    const [userInfo , setUserInfo]  = useState(null);
    const [folders, setFolders]  = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    return (
        <userContext.Provider value={{userInfo, setUserInfo, folders, setFolders , selectedFolder, setSelectedFolder}}>
            {children}
        </userContext.Provider>
    )
}