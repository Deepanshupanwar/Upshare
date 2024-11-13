import { Routes, Route } from 'react-router-dom';
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import SelectedFolder from "./Components/SelectedFolder";
import { useContext, useState } from "react";
import CreateBox from "./Components/CreateBox";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import LandingPage from './Pages/LandingPage';
import { userContext } from './Context/UserContext';
import { ToastContainer } from 'react-toastify';

export default function App() {
  const [open, setOpen] = useState(false);
  const {userInfo} = useContext(userContext);
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} /> {/* Add this line */}
      <Route path="/" element={
       <> <ToastContainer /> {userInfo ? <div className="h-screen overflow-hidden no-scrollbar">
          <Navbar setOpen={setOpen}/>
          <div className="flex h-[calc(100%-60px)] overflow-y-auto no-scrollbar">
            <div className=" max-md:hidden bg-base-200 w-96 overflow-y-auto no-scrollbar">
              <Sidebar setOpen={setOpen}/>
            </div>
            <SelectedFolder/>
          </div>
          <CreateBox open={open} setOpen={setOpen}/>
        </div>
        : <LandingPage />}
        </>
      } />
    </Routes>
  );
}
