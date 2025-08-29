import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LogOut, Calendar, User, Star, Trophy, CheckCircle2, Clock } from "lucide-react";
import Logo from "../../assets/logo.png";
import API from "../../api";

export default function MemberDashboard() {
   // Get eventId (renamed as eventCode) and member email from the URL params
  const { eventId: eventCode, email } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);   // Loading state for the whole page
  const [error, setError] = useState("");   // Error message if API fails
  const [adminData, setAdminData] = useState(null); // Store event info (name, code)
  const [loadingTaskId, setLoadingTaskId] = useState(null); // Track loading per task

  // Fetch tasks for the logged-in member
  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
       // Call backend to get event details by eventCode
      const res = await API.get(`/events?code=${eventCode}`);
        // If no event found set error state
      if (!res.data || res.data.length === 0) {
        setError("Event not found");
        setTasks([]);
        setAdminData(null);
        return;
      }
      
      // Event found save event details
      const event = res.data[0];
      setAdminData({
        eventName: event.name || "Unnamed Event",
        eventCode: event.code
      });
      // Filter tasks assigned onlhy to this member
      const memberTasks = (event.tasks || []).filter(
        (t) => t.assignedTo?.email === email
      );
      setTasks(memberTasks);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks");
      setTasks([]);
      setAdminData(null);
    } finally {
      setLoading(false);  // Stop loading 
    }
  };

    // Run fetchTasks only once when component first login
  useEffect(() => {
    fetchTasks();
  }, []);

   // Handle "Mark Completed" button 
  const handleMarkComplete = async (taskId) => {
    setLoadingTaskId(taskId); // Show loading for this task
    try {
      // Update task status in backend
      await API.patch(`/events/${eventCode}/tasks/${taskId}`, { status: "completed" });
      // Update task status in UI using previous array just before update
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: "completed" } : t))
      );
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Failed to mark task as completed. Please try again."); // Show error to user
    } finally {
      setLoadingTaskId(null); // Reset loading state
    }
  };
//calculate completion rate of tasks
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

   // Show loading screen while fetching
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading tasks...</p>
        </div>
      </div>
    );
  }
  // Show error screen if API fails
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }
  // If no admin data (event not loaded properly)
  if (!adminData) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">No Event Data</h2>
          <p className="text-gray-500 mt-2">No event data available.</p>
        </div>
      </div>
    );
  }
// main layout
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <aside className="w-80 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white flex flex-col shadow-2xl">
        <div className="flex items-center justify-center h-28 px-6 pt-6">
          <img src={Logo} alt="Logo" className="h-14 w-auto drop-shadow-lg" />
        </div>

        <div className="px-6 py-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white capitalize">{email}</h3>
                <p className="text-blue-200 text-sm">Team Member</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-2">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-sm text-gray-300">Completion Rate</span>
            </div>
            <div className="text-2xl font-bold text-white">{completionRate}%</div>
            <div className="text-sm text-gray-300">
              {completedTasks} of {totalTasks} tasks
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-auto mx-6 mb-6 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-sm text-blue-100 hover:text-white transition-all duration-200 backdrop-blur-sm group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 px-8 py-8 mb-6">
          <div className="flex items-center mb-2">
            <Star className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">My Dashboard</h1>
          </div>
          <p className="text-blue-100 text-lg font-medium">
            Here are Your Tasks for the ongoing event{" "}
            <span className="text-yellow-300 font-semibold">{adminData.eventName}</span>
          </p>
        </div>

        {/* Tasks */}
        <div className="p-8">
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-3xl shadow-lg p-12 max-w-md mx-auto">
                <CheckCircle2 className="w-10 h-10 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">All Caught Up!</h3>
                <p className="text-gray-500 text-lg">No tasks assigned yet.</p>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {tasks.map((t) => (
                <li
                  key={t._id}
                  className={`bg-white rounded-2xl shadow-lg border-2 p-6 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${t.status === 'completed' ? 'opacity-75' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center mb-3">
                        {t.status === 'completed' ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                        ) : (
                          <Clock className="w-6 h-6 text-indigo-600 mr-3" />
                        )}
                        {/* /if completed draw line and mark as completed */}
                        <p className={`font-medium text-xl ${t.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {t.title}
                        </p>
                      </div>
                      <div className="flex items-center mb-1">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <p className="text-sm text-gray-600">
                          Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : "No deadline"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Assigned to: {t.assignedTo.name} ({t.assignedTo.email})
                      </p>
                    </div>
                    {/* check the status and if not completed display the button */}
                    {t.status !== 'completed' && (
                      <button
                        onClick={() => handleMarkComplete(t._id)}
                        // disable the button so user can not click it again
                        disabled={loadingTaskId === t._id}
                        className={`px-3 py-1 rounded-lg transition ${
                          loadingTaskId === t._id ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {loadingTaskId === t._id ? "Updating..." : "Mark Completed"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
