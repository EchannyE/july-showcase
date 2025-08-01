import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// The main ReceiptsList component
const ReceiptsList = () => {
  // State variables for managing component data and UI state
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [fetchError, setFetchError] = useState(null); // New state for API call errors
  const location = useLocation();

  // useCallback to memoize the fetch function, improving performance
  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    setFetchError(null); // Reset error state before fetching
    try {
      const res = await axios.get('http://localhost:8080/api/ocr/receipts', {
        withCredentials: true,
      });
      // Ensure data is an array before setting state
      setReceipts(res.data.receipts || []);
    } catch (err) {
      console.error('Fetch error:', err);
      // Set a user-friendly error message if the fetch fails
      setFetchError('Failed to fetch receipts. Please check the server connection and try again.');
      setReceipts([]); // Clear receipts on error
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect to fetch receipts on component mount or when a refresh is triggered
  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts, location.state?.refresh]);

  // useMemo to efficiently calculate monthly totals for the chart
  const monthlyTotals = useMemo(() => {
    return receipts.reduce((acc, receipt) => {
      // Skip receipts without amount or date
      if (!receipt.amount || !receipt.date) return acc;
      const date = new Date(receipt.date);
      // Format month as YYYY-MM
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[month] = (acc[month] || 0) + parseFloat(receipt.amount);
      return acc;
    }, {});
  }, [receipts]);

  // useMemo to prepare chart data from monthly totals
  const chartData = useMemo(() => {
    return Object.entries(monthlyTotals)
      .map(([month, total]) => ({
        month,
        total: parseFloat(total.toFixed(2)),
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [monthlyTotals]);

  // useMemo to filter and sort receipts based on the search input
  const filteredAndSortedReceipts = useMemo(() => {
    const filtered = filter
      ? receipts.filter(
          (r) =>
            r.category?.toLowerCase().includes(filter.toLowerCase()) ||
            r.merchant?.toLowerCase().includes(filter.toLowerCase()) ||
            (r.date && new Date(r.date).toLocaleDateString().includes(filter))
        )
      : receipts;

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [receipts, filter]);

  // useMemo to calculate the total amount spent (unfiltered)
  const totalSpent = useMemo(() => {
    return receipts.reduce(
      (sum, r) => sum + (parseFloat(r.amount) || 0),
      0
    );
  }, [receipts]);

  // New useMemo to calculate the total amount of filtered receipts
  const filteredTotalSpent = useMemo(() => {
    return filteredAndSortedReceipts.reduce(
      (sum, r) => sum + (parseFloat(r.amount) || 0),
      0
    );
  }, [filteredAndSortedReceipts]);

  // Conditional rendering for loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600">Loading receipts...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-inter flex flex-col items-center">
      <div className="max-w-4xl w-full">
        {/* Header and Total Spent */}
        <div className="bg-white p-6 rounded-xl shadow-xl mb-8 border-t-4 border-indigo-500">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Your Receipts Dashboard</h1>
          <p className="text-center text-gray-600 mb-4">View your spending history and analytics below.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg flex-1 w-full">
              <h3 className="text-lg font-semibold text-indigo-700">Total Spent:</h3>
              <p className="text-3xl font-bold text-indigo-900 mt-1">
                ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            {filter && (
              <div className="text-center p-4 bg-green-50 rounded-lg flex-1 w-full">
                <h3 className="text-lg font-semibold text-green-700">Filtered Total:</h3>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  ${filteredTotalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fetch Error Display */}
        {fetchError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm" role="alert">
            <p className="font-bold">Error</p>
            <p>{fetchError}</p>
          </div>
        )}

        {/* Monthly Chart */}
        <div className="bg-white p-6 rounded-xl shadow-xl mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Monthly Spending Chart
          </h2>
          {chartData.length === 0 ? (
            <p className="text-center text-gray-500 italic">No data available for chart.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Bar dataKey="total" fill="#4F46E5" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Filter and Clear Filter button */}
        <div className="flex gap-2 max-w-4xl w-full mb-6">
          <input
            type="text"
            placeholder="Filter by merchant, category or date..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
          {filter && (
            <button
              onClick={() => setFilter('')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition duration-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Receipt List */}
        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Your Receipts
          </h2>
          {filteredAndSortedReceipts.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              {filter ? "No receipts match your filter." : "No receipts uploaded yet."}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAndSortedReceipts.map((receipt) => (
                <div
                  key={receipt._id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200"
                >
                  {receipt.imageUrl ? (
                    <img
                      src={`http://localhost:8080${receipt.imageUrl}`}
                      alt={`Receipt from ${receipt.merchant}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                      className="w-full h-48 object-contain mb-2 rounded-md"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-md mb-2">
                      <p className="italic text-sm text-center text-gray-500">
                        Image not available
                      </p>
                    </div>
                  )}
                  <p className="text-gray-800">
                    <strong>Merchant:</strong> {receipt.merchant || 'N/A'}
                  </p>
                  <p className="text-gray-800">
                    <strong>Amount:</strong> $
                    {receipt.amount
                      ? Number(receipt.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })
                      : 'N/A'}
                  </p>
                  <p className="text-gray-800">
                    <strong>Category:</strong>{' '}
                    {receipt.category || 'Uncategorized'}
                  </p>
                  <p className="text-gray-800">
                    <strong>Date:</strong>{' '}
                    {receipt.date
                      ? new Date(receipt.date).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptsList;
