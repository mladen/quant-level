import React from 'react';

const StockRow = ({ stock }) => {
  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', // abbreviated day of the week
      day: '2-digit', // day as two digits
      month: 'short', // abbreviated month
      year: 'numeric' // four digit year
    });
  };

  return (
    <tr>
      <td>{stock.Ticker}</td>
      <td>{stock.Name}</td>
      <td>{formatDate(stock.Date)}</td>
      <td>{stock.Open.toFixed(2)}</td>
      <td>{stock.High.toFixed(2)}</td>
      <td>{stock.Low.toFixed(2)}</td>
      <td>{stock.Close.toFixed(2)}</td>
      <td>{parseInt(stock.Volume).toLocaleString()}</td>
    </tr>
  );
};

export default StockRow;
