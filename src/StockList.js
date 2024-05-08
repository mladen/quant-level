import React from 'react';
import StockRow from './StockRow';

const StockList = ({ stocks, numberOfStocks, overallInvestmentBudget, displayFilter }) => {
    // Ensure each value is calculated here before passing it to StockRow
    const enhancedStocks = stocks.map(stock => {
        const initialPrice = parseFloat(stock.start_avg);
        const forecastPrice = parseFloat(stock.forecast_price);
        const finalPrice = parseFloat(stock.end_avg);
        const percentageInvested = 100 / numberOfStocks;
        const amountInvested = (percentageInvested / 100) * overallInvestmentBudget;
        const percentageGainedLost = (((finalPrice - initialPrice) / initialPrice) * 100).toFixed(2);
        const amountGainedLost = (amountInvested * (percentageGainedLost / 100)).toFixed(2);

        return {
            ...stock,
            percentageInvested,
            amountInvested,
            forecast_price: forecastPrice,
            percentageGainedLost,
            amountGainedLost
        };
    });

    // Filter based on displayFilter and calculate total gains/losses
    const filteredStocks = enhancedStocks.filter(stock => {
        if (displayFilter === "Show winners") {
            return stock.percentageGainedLost > 0;
        } else if (displayFilter === "Show losers") {
            return stock.percentageGainedLost < 0;
        }
        return true;
    });

    // Calculate totals
    const totalPercentageGainedLost = filteredStocks.reduce((sum, stock) => sum + parseFloat(stock.percentageGainedLost), 0) / (filteredStocks.length || 1);
    const totalAmountGainedLost = filteredStocks.reduce((sum, stock) => sum + parseFloat(stock.amountGainedLost), 0);

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Ticker</th>
                        <th>Name</th>
                        <th>Percentage Invested</th>
                        <th>Amount Invested</th>
                        <th>Initial Price</th>
                        <th>Forecasted Price</th>
                        <th>Final Price</th>
                        <th>Percentage Gained(Lost)</th>
                        <th>Amount Gained(Lost)</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStocks.map((stock, index) => (
                        <StockRow key={index} stock={stock} />
                    ))}
                    <tr className="summary-row">
                        <td colSpan="7" className="text-right">Total:</td>
                        <td className="text-right">{totalPercentageGainedLost.toFixed(2)}%</td>
                        <td className="text-right">${totalAmountGainedLost.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default StockList;
