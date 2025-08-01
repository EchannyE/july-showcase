import React from 'react';


const TransactionsTable = ({ transactions }) => {
  if (!transactions.length) {
    return <p className="text-gray-500">No transactions found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border-b">Date</th>
            <th className="p-2 border-b">Merchant</th>
            <th className="p-2 border-b">Category</th>
            <th className="p-2 border-b">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="hover:bg-gray-50">
              <td className="p-2 border-b">{new Date(tx.date).toLocaleDateString()}</td>
              <td className="p-2 border-b">{tx.merchant}</td>
              <td className="p-2 border-b">{tx.category}</td>
              <td className="p-2 border-b">₦{parseFloat(tx.amount).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
