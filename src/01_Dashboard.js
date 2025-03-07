import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const groupsCollection = await getDocs(collection(db, "groups"));
      setGroups(groupsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchGroups();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    window.location.reload();
  };

  return (
    <div className="bg-gradient-to-b from-teal-500 to-blue-500 min-h-screen flex flex-col items-center justify-center py-10 px-6">
      <div className="bg-white shadow-2xl rounded-lg p-10 w-full max-w-lg transform hover:scale-105 transition-all ease-in-out duration-300">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Logout Button */}
        <button onClick={handleLogout} className="w-full py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all mb-8">
          Logout
        </button>

        {/* Groups List */}
        <ul className="space-y-6">
          {groups.map(group => (
            <li key={group.id} className="transform hover:scale-105 transition-all">
              <Link to={`/group/${group.id}`} className="block p-5 bg-gray-100 text-lg font-semibold text-blue-700 hover:text-blue-900 hover:underline rounded-lg shadow-md">
                {group.name || `Group ${group.id}`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
