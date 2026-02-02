import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Admin Pages
import EventsDashboard from "./pages/Admin/EventsDashboard"
import CommitteeTasks from "./pages/Admin/CommitteeTasks";
import EventTeam from "./pages/Admin/EventTeam";

import HomePage from "./pages/HomePage";

// //admin pages
import AdminSignup from "./pages/Admin/Adminsignup";
import AdminLogin from "./pages/Admin/AdminLogin";

// Member Pages
import MemberDashboard from "./pages/Member/MemberDashboard";
import MemberLogin from "./pages/Member/MemberLogin";
import EventsTeam from "./pages/Admin/EventTeam";

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<HomePage />} />
        {/* Admin Routes */}
         <Route path="/admin/events" element={<EventsDashboard />} />
       {/* <Route path="/admin/event/:eventId" element={<EventOverview />} /> */}
        <Route path="/admin/event/:eventId/tasks" element={<CommitteeTasks />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
         <Route path="/admin/eventsteam" element={<EventsTeam />} />

        {/* Member Routes */}
        <Route path="/member/login" element={<MemberLogin />} />
        <Route path="/member/dashboard/:eventId/:email" element={<MemberDashboard />} />
      
     
     
      </Routes>
    </Router>
  );
}

export default App;
