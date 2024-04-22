import React from 'react';
import StockRow from './StockRow';
import './App.css';

const StockList = ({ stocks }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Name</th>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stockGroup, index) => (
            stockGroup.map((stock, idx) => (
              <StockRow key={`${index}-${idx}`} stock={stock} />
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;

