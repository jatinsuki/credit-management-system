import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [inputUser, setInputUser] = useState({
    name: "",
    contact: "",
    items: "",
    credit: "",
    paidAmt: "0",
  });

  const [showPopup, setShowPopup] = useState(null);
  const [error, setError] = useState("");
  const tableContainerRef = useRef(null);

  const handleChange = (event) => {
    setInputUser({
      ...inputUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputUser.contact.length !== 10) {
      setError("Contact number must be exactly 10 digits.");
      return;
    }
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/createuser", inputUser);
      console.log(res);
      fetchAllUser();
      setShowPopup({ message: 'Customer added successfully and SMS sent.', type: 'success' });
      setTimeout(() => {
        setShowPopup(null);
      }, 3000);

      if (tableContainerRef.current) {
        tableContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setShowPopup({ message: 'Error creating user.', type: 'error' });
      setTimeout(() => {
        setShowPopup(null);
      }, 3000);
    }
  };

  const [userData, setUserData] = useState([]);
  const fetchAllUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/readalluser");
      console.log(res.data);
      setUserData(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAllUser();
  }, []);

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete customer ${name}?`);

    if (confirmDelete) {
      try {
        const res = await axios.delete(`http://localhost:3000/delete/${id}`);
        if (res.status === 200) {
          fetchAllUser();
          setShowPopup({ message: 'Customer deleted successfully.', type: 'success' });
          setTimeout(() => {
            setShowPopup(null);
          }, 3000);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        setShowPopup({ message: 'Error deleting user.', type: 'error' });
        setTimeout(() => {
          setShowPopup(null);
        }, 3000);
      }
    }
  };

  const calculateRemainingAmount = (user) => {
    const credit = parseFloat(user.credit || 0);
    const paidAmt = parseFloat(user.paidAmt || 0);
    return (credit - paidAmt).toFixed(2);
  };

  const getTotalRemainingAmount = () => {
    return userData.reduce((total, user) => {
      const credit = parseFloat(user.credit || 0);
      const paidAmt = parseFloat(user.paidAmt || 0);
      return total + (credit - paidAmt);
    }, 0);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUserData = userData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="sticky top-0 w-full bg-gray-800 text-white text-center py-4 border-b border-gray-300 z-10">
        <h1 className="text-3xl font-bold tracking-wide">CREDIT MANAGEMENT SYSTEM</h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-lg bg-gradient-to-r from-purple-100 via-purple-50 to-white shadow-lg rounded-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Create Credit Sales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 bg-white transition duration-300 ease-in-out"
                  placeholder="Enter name"
                  required
                  value={inputUser.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <input
                  type="text"
                  name="contact"
                  className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 bg-white transition duration-300 ease-in-out"
                  placeholder="Enter Contact no."
                  required
                  maxLength={10}
                  value={inputUser.contact}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Items</label>
                <input
                  type="text"
                  name="items"
                  className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 bg-white transition duration-300 ease-in-out"
                  placeholder="Enter items description"
                  required
                  value={inputUser.items}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sales</label>
                <input
                  type="text"
                  name="credit"
                  className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 bg-white transition duration-300 ease-in-out"
                  placeholder="Enter Sales"
                  required
                  value={inputUser.credit}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Paid Amt</label>
                <input
                  type="text"
                  name="paidAmt"
                  className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 bg-white transition duration-300 ease-in-out"
                  placeholder="Paid Amount"
                  required
                  value={inputUser.paidAmt}
                  onChange={handleChange}
                />
              </div>
            </div>
            {error && (
              <div className="text-red-600">
                {error}
              </div>
            )}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out"
              >
                Add Customer
              </button>
            </div>
          </form>
        </div>

        <div className="w-full max-w-lg mb-4 relative">
          <label htmlFor="search" className="absolute top-3 left-3 text-gray-500">
            <FontAwesomeIcon icon={faSearch} />
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by customer name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 bg-white transition duration-300 ease-in-out placeholder-gray-500"
          />
        </div>

        <div ref={tableContainerRef} className="w-full max-w-6xl overflow-x-auto shadow-lg bg-white rounded-lg mb-6">
          <header className="text-center py-2 font-semibold text-lg mb-2 bg-gray-800 text-white border-b border-gray-300 rounded-t-lg">
            Customer List
          </header>
          <table className="w-full text-lg text-center text-gray-500">
            <thead className="text-white uppercase bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 border-b border-gray-300">Sr No.</th>
                <th scope="col" className="px-6 py-3 border-b border-gray-300">Name</th>
                <th scope="col" className="px-6 py-3 border-b border-gray-300">Contact</th>
                <th scope="col" className="px-6 py-3 border-b border-gray-300">Sales</th>
                <th scope="col" className="px-6 py-3 border-b border-gray-300">Paid Amt</th>
                <th scope="col" className="px-6 py-3 border-b border-gray-300">Credits</th>
                <th scope="col" className="px-6 py-3 border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUserData.map((item, i) => (
                <tr className="bg-gray-50 hover:bg-gray-100 border-b" key={item._id}>
                  <td className="px-6 py-4 font-medium text-gray-900 border-b border-gray-300">{i + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 border-b border-gray-300">{item.name}</td>
                  <td className="px-6 py-4 border-b border-gray-300">{item.contact}</td>
                  <td className="px-6 py-4 border-b border-gray-300">{item.credit}</td>
                  <td className="px-6 py-4 border-b border-gray-300">{item.paidAmt || 0}</td>
                  <td className="px-6 py-4 border-b border-gray-300">{calculateRemainingAmount(item)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-x-4">
                      <NavLink
                        to={`/readuser/${item._id}`}
                        className="text-green-600 hover:text-green-700 flex items-center gap-x-2"
                      >
                        <FontAwesomeIcon icon={faEye} />
                        <span>Read</span>
                      </NavLink>
                      <NavLink
                        to={`/updateuser/${item._id}`}
                        className={`flex items-center gap-x-2 ${item.credit === item.paidAmt ? 'text-gray-400 cursor-not-allowed' : 'text-yellow-400 hover:text-yellow-500'}`}
                        aria-disabled={item.credit === item.paidAmt}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        <span>Edit</span>
                      </NavLink>
                      <button
                        onClick={() => handleDelete(item._id, item.name)}
                        className="text-red-500 hover:text-red-600 flex items-center gap-x-2"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end p-4 text-white uppercase bg-gray-800">
            <div className="flex flex-col items-end bg-gray-800">
              <span className="font-bold text-lg">Total Credits : ₹{getTotalRemainingAmount().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      {showPopup && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${showPopup.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`} role="alert">
          <strong className="font-bold">{showPopup.type === 'success' ? 'Success!' : 'Error!'}</strong>
          <span className="block sm:inline"> {showPopup.message}</span>
        </div>
      )}
    </div>
  );
};

export default Home;
