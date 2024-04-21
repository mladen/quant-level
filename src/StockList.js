import React from 'react';

const StockList = ({ stocks }) => {
  return (
    <div style={{ width: '90%', margin: 'auto', overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            stock.map((data, idx) => (
              <tr key={idx}>
                <td>{data.Ticker}</td>
                <td>{data.Date}</td>
                <td>{data.Open.toFixed(2)}</td>
                <td>{data.High.toFixed(2)}</td>
                <td>{data.Low.toFixed(2)}</td>
                <td>{data.Close.toFixed(2)}</td>
                <td>{data.Volume}</td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;
