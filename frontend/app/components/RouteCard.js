'use client';

import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa';

const RouteCard = ({ route }) => {
  const { totalDuration, cumulativeRisk, legs, path } = route;

  let overallRisk = 'Low';
  if (cumulativeRisk >= 5 && cumulativeRisk < 10) {
    overallRisk = 'Medium';
  } else if (cumulativeRisk >= 10) {
    overallRisk = 'High';
  }

  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  console.log('RouteCard:', route);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Optimal Route</h3>
        <div className={`px-4 py-2 rounded-full text-white font-semibold ${overallRisk === 'Low' ? 'bg-green-500' : overallRisk === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
          {overallRisk}
        </div>
      </div>
      <p className="text-gray-700 mb-4">
        <span className="font-medium">Total Route:</span> {path.join(' → ')}
      </p>
      <p className="text-gray-700 mb-4">
        <span className="font-medium">Total Time:</span> {totalDuration.hrs} hrs : {totalDuration.mins ? totalDuration.mins : 0} mins
      </p>
      <div className="space-y-4">
        {legs.map((leg, index) => (
          <div key={index} className="flex items-center space-x-4">
            <FaExchangeAlt className="text-blue-600" />
            <div>
              <p className="text-gray-700 font-medium">{leg.trainName} ({leg.trainNo})</p>
              <p className="text-gray-600">
                <span className="font-medium">From:</span> {leg.from} &nbsp;|&nbsp; <span className="font-medium">To:</span> {leg.to}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Departure:</span> {leg.departureTime} &nbsp;|&nbsp; <span className="font-medium">Arrival:</span> {leg.arrivalTime}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Duration:</span> {leg.duration.hrs} hrs : {leg.duration.mins ? leg.duration.mins : 0} minutes &nbsp;|&nbsp; <span className="font-medium">Risk:</span> {leg.risk === 1 ? 'Low' : leg.risk === 2 ? 'Medium' : 'High'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteCard;
