'use client';

import React from 'react';
import { FaTrain, FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';

const TrainCard = ({ train }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
      <FaTrain size={40} className="text-blue-600" />
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-800">
          {train.trainName} ({train.trainNo})
        </h3>
        <p className="text-gray-600">
          <span className="font-medium">From:</span> {train.from} &nbsp;|&nbsp; <span className="font-medium">To:</span> {train.to}
        </p>
        <div className="flex flex-wrap mt-2">
          <div className="flex items-center mr-4">
            <FaCalendarAlt className="text-gray-500 mr-1" />
            <span>{train.departureTime} - {train.arrivalTime}</span>
          </div>
          <div className="flex items-center mr-4">
            <FaClock className="text-gray-500 mr-1" />
            <span>{train.totalDuration}</span>
          </div>
          <div className="flex items-center">
            <FaUser className="text-gray-500 mr-1" />
            <span>{train.availability}</span>
          </div>
        </div>
      </div>
      <div className={`px-4 py-2 rounded-full text-white font-semibold ${train.riskFactor === 'Low' ? 'bg-green-500' : train.riskFactor === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
        {train.riskFactor}
      </div>
    </div>
  );
};

export default TrainCard;
