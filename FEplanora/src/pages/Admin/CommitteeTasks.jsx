import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Members from "../../Components/Admin/AddMembers";
import Tasks from "../../Components/Admin/AddTasks";
import Logo from "../../assets/logo.png";
import { Users, ClipboardList, ArrowLeft, Trophy, Calendar } from "lucide-react"; //lucide icons
import API from "../../api";

export default function CommitteeTasks() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Fetch event details on page load or when the event id changes
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${eventId}`);
        setEvent(res.data);
        setMembers(res.data.members || []);
        setTasks(res.data.tasks || []);
      } catch (err) {
        console.error("Failed to fetch event:", err);
      }
    };

    fetchEvent();
  }, [eventId]); 
  //[eventsid] use to fetch events when the id change (navigate another event)

  //Check whether event is loaded or not yet
  if (!event) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <p className="text-slate-600 text-lg">Loading event...</p>
      </div>
    </div>
  );
// If event is loaded, show the page
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-80 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col shadow-2xl">
        <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 mb-4">
            <img src={Logo} alt="PlanOra logo" className="h-12 w-auto drop-shadow-2xl" />
          </div>
          <span className="text-white text-2xl font-bold">PlanOra</span>
          <span className="text-slate-300 text-sm mt-1">Event Management</span>
        </div>

        {/* Event Cards to show events*/}
        <div className="mx-6 mb-6">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6 text-purple-400" />
              <span className="text-slate-300 text-sm font-medium">Current Event</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{event.name}</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs font-medium">Active Session</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 mb-8">
          <div className="bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-semibold">Progress Stats</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">Team Members</span>
                {/* display no of members */}
                <span className="text-white font-bold">{members.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">Total Tasks</span>
                {/* display total no of tasks */}
                <span className="text-white font-bold">{tasks.length}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-auto mx-6 mb-6 flex items-center justify-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-sm text-white hover:text-gray-100 transition-all duration-300 border border-white/20 hover:border-white/30"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Users className="w-8 h-8 text-slate-300" />
                Committee & Tasks
              </h1>
              <p className="text-slate-300 text-lg mt-1">{event.name}</p>
            </div>
          </div>

          
        
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-8 space-y-8">
          {/* Members Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-6 h-6 text-white" />
                </div>
                Team Members
              </h2>
              <p className="text-slate-300 mt-1">Manage your event committee</p>
            </div>
            <div className="p-6">
              <Members event={event} members={members} setMembers={setMembers} />
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                Task Management
              </h2>
              <p className="text-slate-300 mt-1">Assign and track project tasks</p>
            </div>
            <div className="p-6">
              <Tasks event={event} members={members} tasks={tasks} setTasks={setTasks} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}