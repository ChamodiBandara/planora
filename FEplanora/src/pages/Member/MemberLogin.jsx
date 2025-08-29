import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function MemberLogin() {
  const [email, setEmail] = useState(""); // store email
  const [eventCode, setEventCode] = useState(""); // store event code
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      //send data to the backend
      const res = await API.post("/members/login", { email, eventCode });
      const member = res.data;
      // Navigate using email instead of email
      navigate(`/member/dashboard/${eventCode}/${member.email}`);
    } catch (err) {
      setError(err.response?.data.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">Member Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Event Code"
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
