import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api"; // axios instance

export default function AdminSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  // update form data when input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // run when user clicks signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    //validation
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      // send data to the backend
      await API.post("/admin/signup", { email, password });

      // alert when signup is successful
      alert(`Welcome to PlanOra!`);

      // Reset the value of form
      setFormData({
        email: "",
        password: "",
      });

      // Redirect to admin events page
      navigate("/admin/events");
    } catch (err) {
      setError(err.response?.data.message || "Signup failed");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
            Admin Signup
          </h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
                placeholder="Enter email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
                placeholder="Enter password"
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Signup
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-gray-500 mt-4 text-center">
            Already have an account?{" "}
            <span
              className="text-indigo-600 cursor-pointer hover:underline"
              onClick={() => navigate("/admin/login")}
            >
              Login
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
