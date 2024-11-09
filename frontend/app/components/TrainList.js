// app/components/TrainList.js
'use client';

import React, { useState, useEffect } from 'react';
import TrainCard from './TrainCard';

const TrainList = ({ searchParams }) => {
  const [trains, setTrains] = useState([]);
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    availability: 'All',
    riskFactor: 'All',
    sortBy: 'departureTime', // or 'arrivalTime', 'totalDuration'
  });

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const res = await fetch('/data.json');
        const data = await res.json();
        // Filter trains based on search parameters
        const filtered = data.filter(
          (train) =>
            train.from.toLowerCase() === searchParams.from.toLowerCase() &&
            train.to.toLowerCase() === searchParams.to.toLowerCase()
        );
        setTrains(filtered);
        setFilteredTrains(filtered);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching train data:', error);
        setLoading(false);
      }
    };

    fetchTrains();
  }, [searchParams]);

  useEffect(() => {
    let updatedTrains = [...trains];

    // Apply Availability Filter
    if (filters.availability !== 'All') {
      updatedTrains = updatedTrains.filter(
        (train) => train.availability === filters.availability
      );
    }

    // Apply Risk Factor Filter
    if (filters.riskFactor !== 'All') {
      updatedTrains = updatedTrains.filter(
        (train) => train.riskFactor === filters.riskFactor
      );
    }

    // Apply Sorting
    if (filters.sortBy === 'departureTime') {
      updatedTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    } else if (filters.sortBy === 'arrivalTime') {
      updatedTrains.sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime));
    } else if (filters.sortBy === 'totalDuration') {
      updatedTrains.sort((a, b) => {
        const aDuration = parseDuration(a.totalDuration);
        const bDuration = parseDuration(b.totalDuration);
        return aDuration - bDuration;
      });
    }

    setFilteredTrains(updatedTrains);
  }, [filters, trains]);

  const parseDuration = (duration) => {
    const [hours, minutes] = duration.split('h').map((part) => parseInt(part));
    return hours * 60 + (isNaN(minutes) ? 0 : minutes);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (filteredTrains.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-800">No trains found for the selected route.</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
        {/* Availability Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="availability" className="text-gray-700 font-medium">
            Availability:
          </label>
          <select
            name="availability"
            id="availability"
            value={filters.availability}
            onChange={handleFilterChange}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Full">Full</option>
          </select>
        </div>

        {/* Risk Factor Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="riskFactor" className="text-gray-700 font-medium">
            Risk Factor:
          </label>
          <select
            name="riskFactor"
            id="riskFactor"
            value={filters.riskFactor}
            onChange={handleFilterChange}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="sortBy" className="text-gray-700 font-medium">
            Sort By:
          </label>
          <select
            name="sortBy"
            id="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="departureTime">Departure Time</option>
            <option value="arrivalTime">Arrival Time</option>
            <option value="totalDuration">Total Duration</option>
          </select>
        </div>
      </div>

      {/* Train Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrains.map((train) => (
          <TrainCard key={train.id} train={train} />
        ))}
      </div>
    </div>
  );
};

export default TrainList;
