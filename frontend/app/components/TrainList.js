'use client';

import React, { useState, useEffect } from 'react';
import RouteCard from './RouteCard';
import { findOptimalRoutes, buildGraph } from '../utils/algorithm';

const TrainList = ({ searchParams }) => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    riskFactor: 'All',
    sortBy: 'totalDuration',
  });

  useEffect(() => {
    const fetchAndProcessTrains = async () => {
      try {
        const res = await fetch('/data.json');
        const data = await res.json();
        const graph = buildGraph(data);
        const optimalRoutes = findOptimalRoutes(graph, searchParams.from, searchParams.to);
        setRoutes(optimalRoutes);
        setFilteredRoutes(optimalRoutes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or processing train data:', error);
        setLoading(false);
      }
    };

    if (searchParams) {
      setLoading(true);
      fetchAndProcessTrains();
    }
  }, [searchParams]);

  useEffect(() => {
    let updatedRoutes = [...routes];

    if (filters.riskFactor !== 'All') {
      const riskValue = filters.riskFactor;
      updatedRoutes = updatedRoutes.filter(route => {
        let overallRisk = 'Low';
        if (route.cumulativeRisk >= 5 && route.cumulativeRisk < 10) {
          overallRisk = 'Medium';
        } else if (route.cumulativeRisk >= 10) {
          overallRisk = 'High';
        }
        return overallRisk === riskValue;
      });
    }

    if (filters.sortBy === 'totalDuration') {
      updatedRoutes.sort((a, b) => a.totalDuration - b.totalDuration);
    } else if (filters.sortBy === 'cumulativeRisk') {
      updatedRoutes.sort((a, b) => a.cumulativeRisk - b.cumulativeRisk);
    }

    setFilteredRoutes(updatedRoutes);
  }, [filters, routes]);

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

  if (routes.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-800">No optimal routes found for the selected route.</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
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
            <option value="totalDuration">Total Duration</option>
            <option value="cumulativeRisk">Risk Factor</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {
          filteredRoutes.length > 0 ? (
            filteredRoutes.map((route, index) => (
              <RouteCard key={index} route={route} />
            ))
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-800">No filtered routes found for the selected filter.</h2>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default TrainList;
