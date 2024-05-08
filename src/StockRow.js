import React from 'react';

const StockRow = ({ stock }) => {
    return (
        <tr>
            <td>{stock.ticker}</td>
            <td>{stock.company_name}</td>
            <td className="text-right">{stock.percentageInvested.toFixed(2)}%</td>
            <td className="text-right">${stock.amountInvested.toFixed(0)}</td>
            <td className="text-right">${parseFloat(stock.start_avg).toFixed(2)}</td>
            <td className="text-right">{stock.forecast_price ? `$${parseFloat(stock.forecast_price).toFixed(2)}` : '/'}</td>
            <td className="text-right">${parseFloat(stock.end_avg).toFixed(2)}</td>
            <td className="text-right">{stock.percentageGainedLost}%</td>
            <td className="text-right">${stock.amountGainedLost}</td>
        </tr>
    );
};

export default StockRow;

