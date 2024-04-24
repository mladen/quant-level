import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import DateInput from "./DateInput";
import ComboBox from "./ComboBox";
import NumberInput from "./NumberInput";
import ListButton from "./ListButton";
import StockList from "./StockList";

import { format, addDays } from "date-fns";
import Dashboard from "./dashboard/Dashboard";
// import { LineChart } from "@mui/x-charts";

function App() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [forecastMethodology, setForecastMethodology] = useState("");
  const [numberOfStocks, setNumberOfStocks] = useState(5);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const handleListStocks = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/fetch_stocks",
          {
            startDate,
            endDate,
            numberOfStocks,
            tickers: [
              "AAPL",
              "AMZN",
              "BAC",
              "BRK-B",
              "DIS",
              "GOOGL",
              "HD",
              "JNJ",
              "JPM",
              "KO",
              "MA",
              "META",
              "MSFT",
              "NVDA",
              "PG",
              "TSLA",
              "UNH",
              "V",
              "WMT",
              "XOM",
            ],
          }
        );
        setStocks(response.data);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    const today = new Date();
    const thirtyDaysAgo = addDays(today, -30);
    setStartDate(format(thirtyDaysAgo, "yyyy-MM-dd"));
    setEndDate(format(today, "yyyy-MM-dd"));
    handleListStocks();
  }, [startDate, endDate, numberOfStocks]); // Run when dependencies change

  const handleNumberChange = (event) => {
    const number = parseInt(event.target.value, 10); // Convert input value to integer
    if (!isNaN(number) && number >= 3 && number <= 20) {
      setNumberOfStocks(number);
    }
  };

  return (
    <div className="App">
      <Dashboard stocks={stocks} />

      <div className="container">
        <div className="left-panel">
          <DateInput
            label="Start Date"
            name="startDate"
            onDateChange={setStartDate}
          />
          <DateInput
            label="End Date"
            name="endDate"
            onDateChange={setEndDate}
          />
        </div>
        <div className="right-panel">
          <ComboBox
            label="Forecast Methodology"
            name="forecastMethodology"
            options={["Method 1", "Method 2"]}
            onSelect={setForecastMethodology}
          />
          <NumberInput
            label="Number of Stocks"
            name="numberOfStocks"
            value={numberOfStocks}
            onNumberChange={handleNumberChange}
            min="3"
            max="20"
          />
          {/* <ListButton onClick={handleListStocks} /> */}
        </div>
      </div>
      <StockList stocks={stocks} />
    </div>
  );
}

export default App;
