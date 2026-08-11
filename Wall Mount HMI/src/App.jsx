import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Otp from "./pages/Otp";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import { Home } from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import ResetPassword from "./pages/ResetPassword";
import Scheduler from "./pages/Scheduler";
import Scenes from "./pages/Scenes";
import CreateScene from "./pages/CreateScene";
import SmartHome from "./pages/SmartHome";
import Routine from "./pages/Routine";
import Profile from "./pages/Profile";
import AllDevices from "./pages/AllDevices";
import ScanDevices from "./pages/ScanDevices";
import Dashboard from "./pages/Dashboard";
import Loading from "./pages/Loading";
import Pairing from "./pages/Pairing";
import DashboardMenu from "./pages/DashboardMenu";
import Agent from "./pages/Agent";  
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<SmartHome />} />

        <Route path="/onboarding" element={<Onboarding />} />

        <Route path="/signup" element={<SignUp />} />

        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/resetpassword" element={<ResetPassword />} />
<Route path="/profile" element={<Profile />} />
        <Route path="/otp" element={<Otp />} />

        <Route path="/scheduler" element={<Scheduler />} />

        <Route path="/scenes" element={<Scenes />} />

        <Route path="/createscene" element={<CreateScene />} />

        <Route path="/routine" element={<Routine />} />

        <Route path="/all-devices" element={<AllDevices />} />

        <Route path="/scan-devices" element={<ScanDevices />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/loading" element={<Loading />} />
          <Route path="/pairing" element={<Pairing />} />
          <Route path="/dashboard-menu" element={<DashboardMenu />} />
            <Route path="/agent" element={<Agent />} />
             <Route path="/rooms" element={<Rooms />} />
             <Route path="/room-details" element={<RoomDetails />} />
         

      </Routes>
    </BrowserRouter>
  );
}

export default App;