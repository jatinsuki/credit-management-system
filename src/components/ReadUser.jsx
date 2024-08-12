import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ReadUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [itemsData, setItemsData] = useState("");

  // Fetch single user data
  const fetchSingleUser = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/read/${id}`);
      setUserData(res.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchSingleUser();
  }, [id]);

  // Handle Lists button click
  const handleListsClick = () => {
    setItemsData(userData.items);
    setShowPopup(true);
  };

  // Close popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Calculate Remaining Amount
  const calculateRemainingAmount = () => {
    const credit = parseFloat(userData.credit || 0);
    const paidAmt = parseFloat(userData.paidAmt || 0);
    return (credit - paidAmt).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="w-full bg-gray-800 text-white text-center py-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold">CREDIT MANAGEMENT SYSTEM</h1>
      </header>

      <main className="w-full mx-auto mt-5 px-4 max-w-4xl">
        <div className="relative overflow-x-auto shadow-lg bg-white rounded-lg">
          <header className="text-center py-2 font-semibold text-lg mb-2 bg-gray-800 text-white border-b border-gray-300 rounded-t-lg">
            User Details
          </header>

          <table className="w-full text-lg text-center text-gray-500">
            <thead className="text-[17px] text-white uppercase bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 border-r border-gray-300">
                  SN.
                </th>
                <th scope="col" className="px-6 py-3 border-r border-gray-300">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 border-r border-gray-300">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 border-r border-gray-300">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 border-r border-gray-300">
                  Credits
                </th>
                <th scope="col" className="px-6 py-3 border-r border-gray-300">
                  Paid Amt
                </th>
                <th scope="col" className="px-6 py-3">
                  Remaining Amt
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-gray-50 hover:bg-gray-100">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-r border-gray-300">
                  1
                </th>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-r border-gray-300">
                  {userData.name}
                </td>
                <td className="px-6 py-4 border-r border-gray-300">
                  {userData.contact}
                </td>
                <td className="px-6 py-4 border-r border-gray-300">
                  <button
                    onClick={handleListsClick}
                    className="px-4 py-2 bg-gray-800 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
                  >
                    Lists
                  </button>
                </td>
                <td className="px-6 py-4 border-r border-gray-300">
                  {userData.credit}
                </td>
                <td className="px-6 py-4 border-r border-gray-300">
                  {userData.paidAmt || 0}
                </td>
                <td className="px-6 py-4">
                  {calculateRemainingAmount()}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end p-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-800 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
            >
              Go to Home
            </button>
          </div>
        </div>
      </main>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <p>{itemsData}</p>
            <button
              onClick={handleClosePopup}
              className="px-4 py-2 bg-gray-800 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadUser;
