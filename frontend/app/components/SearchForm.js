'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchForm = ({ onSearch }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ from: start, to: end, date });
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold text-center text-blue-600">Find Your Train</h2>
        <div>
          <label className="block text-gray-700">From</label>
          <input
            type="text"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            placeholder="Starting Station"
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          />
        </div>
        <div>
          <label className="block text-gray-700">To</label>
          <input
            type="text"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
            placeholder="Destination Station"
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          />
        </div>
        <div>
          <label className="block text-gray-700">Date of Travel</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Searching...
            </span>
          ) : (
            <>
              <FaSearch className="mr-2" /> Search Trains
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
