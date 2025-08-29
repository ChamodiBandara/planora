import React, { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import API from "../../api";

//Component props (attributes pass by parent to child),members->child committeetask->parent
export default function Members({ event, members, setMembers }) {
  const [showForm, setShowForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [error, setError] = useState("");  //store validations and error messages

  // Add member when save
  const addMember = async () => {
    setError("");
    if (!newMemberName || !newMemberEmail) {
      setError("Name and Email are required");
      return;
    } //validate the inputs
//send request to backend to create member
    try {
      const res = await API.post(`/events/${event._id}/members`, {
        name: newMemberName,
        email: newMemberEmail,
      });

      setMembers(res.data.eventMembers); // update parent status with the updated member list
      //fields reset to blank and close the form
      setNewMemberName("");
      setNewMemberEmail("");
      setShowForm(false);

      alert("Member added successfully!");
    } catch (err) {
      setError(err.response?.data.error || "Failed to add member");
    }
  };

  // Delete member by unique identifier member id
const deleteMember = async (memberId) => {
  if (!window.confirm("Are you sure you want to delete this member?")) return;

  try {
    const res = await API.delete(`/events/${event._id}/members/${memberId}`);
    if (res.data && res.data.eventMembers) {
      setMembers(res.data.eventMembers); // update state with backend response
      alert("Member deleted successfully!");
    } else {
      throw new Error(res.data?.error || "Unexpected response from server");
    }
  } //response not as expected run catch
  catch (err) {
    console.error(err);
    if (err.response?.status === 404) {
      alert("Failed to delete member! Member not found (already deleted or invalid ID).");
    } else {
      alert(`Failed to delete member! ${err.response?.data?.error || err.message}`);
    }
  }
};


  return (
   <div className="mb-8">
  <div className="flex justify-between items-center mb-3">
    <h2 className="text-xl font-semibold">Committee Members</h2>
{/* show the add member form when button click */}
    {!showForm && (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        <Plus size={18} /> Add Member
      </button>
    )}
  </div>
{/* error displaying */}
  {error && <p className="text-red-500 mb-3">{error}</p>}
{/*Display the  List of members */}
  <ul className="space-y-2 mb-3">
    {/* loop  throug the mebers array */}
    {members.map((m) => (
      <li
        key={m._id} // use _id  as key
        className="flex justify-between items-center bg-white shadow px-4 py-2 rounded-lg"
      >
        <span>
          {m.name} ({m.email})
        </span>
        <button
          onClick={() => deleteMember(m._id)} 
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </li>
    ))}
  </ul>
{/* if showform = true render the form */}
  {showForm && (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Add New Member</h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>
        <label className="block text-gray-700 font-medium mb-1">Member Name</label>
      <input
        type="text"
        value={newMemberName} 
        onChange={(e) => setNewMemberName(e.target.value)}
        placeholder="Member Name"
        className="border px-3 py-2 rounded-lg w-full"
      />
      <label className="block text-gray-700 font-medium mb-1">Member Email</label>
      <input
        type="email"
        value={newMemberEmail}
        
        onChange={(e) => setNewMemberEmail(e.target.value)}
        placeholder="Member Email"
        className="border px-3 py-2 rounded-lg w-full"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowForm(false)}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>
        <button
          onClick={addMember}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </div>
  )}
</div>

  );
}
