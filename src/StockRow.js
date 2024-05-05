import React from 'react';

const StockRow = ({ stock }) => {
    return (
        <tr>
            <td>{stock.ticker}</td>
            <td>{stock.company_name}</td>
            <td>{stock.percentageInvested.toFixed(2)}%</td>
            <td>${stock.amountInvested.toFixed(0)}</td>
            <td>${parseFloat(stock.start_avg).toFixed(2)}</td>
            <td>${parseFloat(stock.end_avg).toFixed(2)}</td>
            <td>{stock.percentageGainedLost}%</td>
            <td>${stock.amountGainedLost}</td>
        </tr>
    );
};

export default StockRow;
