import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const username = localStorage.getItem("username");

  return (
    <div className="max-w-md mx-auto p-4 mt-10 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl text-center my-5">Welcome to Dashboard</h1>
      {username && (
        <p className="text-lg text-gray-600">Welcome, {username}!</p>
      )}
      <Link
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        to={"/examlist"}
      >
        Show Exam List
      </Link>

      
    </div>
  );
}
