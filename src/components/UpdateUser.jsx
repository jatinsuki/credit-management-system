import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UpdateUser = () => {
  const [inputUser, setInputUser] = useState({
    name: "",
    contact: "",
    credit: "",
    paidAmt: "0", // Initialize Paid Amt as "0"
  });

  const [originalPaidAmt, setOriginalPaidAmt] = useState(0); // State to hold the original Paid Amt
  const [isEditing, setIsEditing] = useState(true); // State to manage editability
  const { id } = useParams();

  // Data fetching for a single user
  const fetchSingleUser = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/read/${id}`);
      const existingPaidAmt = parseFloat(res.data.paidAmt || 0);

      setInputUser({
        name: res.data.name,
        contact: res.data.contact,
        credit: res.data.credit,
        paidAmt: "", // Keep the Paid Amt input empty for new entry
      });

      setOriginalPaidAmt(existingPaidAmt); // Save the original Paid Amt

      // Check if Credits equals Paid Amt to set editability
      if (parseFloat(res.data.credit) === existingPaidAmt) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchSingleUser();
  }, [id]);

  const handleChange = (event) => {
    setInputUser({
      ...inputUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newPaidAmt = originalPaidAmt + parseFloat(inputUser.paidAmt || 0);

    try {
      const res = await axios.put(`http://localhost:3000/updateuser/${id}`, {
        ...inputUser,
        paidAmt: newPaidAmt.toString(), // Convert to string for consistency
      });

      if (res.status === 200) {
        window.location = "/";
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user. Please try again."); // Basic error handling
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-gray-800 text-white text-center py-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold">CREDIT MANAGEMENT SYSTEM</h1>
      </header>

      {/* Form */}
      <main className="w-full mx-auto mt-5 px-4 max-w-4xl">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 mx-auto mt-6">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Customer Details</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                className={`block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out ${!isEditing ? 'bg-gray-200' : ''}`}
                placeholder="Enter name"
                required
                value={inputUser.name}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
              <input
                type="text"
                name="contact"
                className={`block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out ${!isEditing ? 'bg-gray-200' : ''}`}
                placeholder="Enter Contact no."
                required
                value={inputUser.contact}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sales</label>
              <input
                type="text"
                name="credit"
                className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                placeholder="Enter Credits"
                required
                value={inputUser.credit}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Paid Amt</label>
              <input
                type="text"
                name="paidAmt"
                className={`block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out ${!isEditing ? 'bg-gray-200' : ''}`}
                placeholder={`Enter additional Paid Amount (Previous: ₹${originalPaidAmt})`}
                value={inputUser.paidAmt}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className={`px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isEditing}
              >
                Update Customer
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UpdateUser;
