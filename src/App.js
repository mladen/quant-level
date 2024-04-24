import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import DateInput from './DateInput';
import ForecastMethodology from './ForecastMethodology';
import InvestmentInput from './InvestmentInput';
import NumberInput from './NumberInput';
import DisplayFilter from './DisplayFilter';
import ListButton from './ListButton';
import StockList from './StockList';

function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [forecastMethodology, setForecastMethodology] = useState('');
  const [overallInvestmentBudget, setOverallInvestmentBudget] = useState('');
  const [stocks, setStocks] = useState([]);
  const [overallBudget, setOverallBudget] = useState('');
  const [numberOfStocks, setNumberOfStocks] = useState(5);
  const [displayFilter, setDisplayFilter] = useState('Show all');

  const handleListStocks = async () => {
    try {
      const response = await axios.post('http://localhost:5000/fetch_stocks', {
        startDate,
        endDate,
        numberOfStocks,
        overallBudget,
        displayFilter: displayFilter,
        tickers: [
          'AAPL', 'AMZN', 'BAC', 'BRK-B', 'DIS', 'GOOGL', 'HD', 'JNJ', 'JPM', 'KO',
          'MA', 'META', 'MSFT', 'NVDA', 'PG', 'TSLA', 'UNH', 'V', 'WMT', 'XOM'
        ]
      });
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const handleNumberChange = (event) => {
    const number = parseInt(event.target.value, 10); // Convert input value to integer
    if (!isNaN(number) && number >= 3 && number <= 20) {
      setNumberOfStocks(number);
    }
  };

  return (
    <div className="App">
      {/* New container for the three-column layout */}
      <div className="three-column-container">
        {/* Area 1: Dates */}
        <div className="column">
          <DateInput label="Start Date" name="startDate" onDateChange={setStartDate} />
          <DateInput label="End Date" name="endDate" onDateChange={setEndDate} />
        </div>

        {/* Area 2: Forecast Methodology and Display Filter */}
        <div className="column">
          <ForecastMethodology 
            label="Forecast Methodology"
            onSelect={setForecastMethodology} 
          />
          <DisplayFilter onSelect={setDisplayFilter} />
        </div>

        {/* Area 3: Overall Investment Budget, Number of Stocks, and List Button */}
        <div className="column">
          <InvestmentInput 
            label="Overall Investment Budget"
            min={100} // Minimum of $100
            max={100000000000} // Maximum of $100 billion
            value={overallInvestmentBudget}
            onInvestmentChange={setOverallInvestmentBudget}
          />
          <NumberInput 
            label="Number of Stocks" 
            name="numberOfStocks" 
            value={numberOfStocks} 
            onNumberChange={handleNumberChange} 
            min="3" 
            max="20"
          />
          <div className="column-button">
            <ListButton onClick={handleListStocks} />
          </div>
        </div>
      </div>

      {/* Stock list remains unchanged */}
      <StockList stocks={stocks} />
    </div>
  );
}

export default App;
