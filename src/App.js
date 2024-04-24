import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import DateInput from "./DateInput";
import ComboBox from "./ComboBox";
import NumberInput from "./NumberInput";
import ListButton from "./ListButton";
import StockList from "./StockList";

import Dashboard from "./dashboard/Dashboard";
// import { LineChart } from "@mui/x-charts";

function App() {
  const [forecastMethodology, setForecastMethodology] = useState("");
  const [stocks, setStocks] = useState([]);

  return (
    <div className="App">
      <Dashboard />

      <div className="container">
        <div className="left-panel">
          {/* <DateInput
            label="Start Date"
            name="startDate"
            onDateChange={setStartDate}
          />
          <DateInput
            label="End Date"
            name="endDate"
            onDateChange={setEndDate}
          /> */}
        </div>
        <div className="right-panel">
          <ComboBox
            label="Forecast Methodology"
            name="forecastMethodology"
            options={["Method 1", "Method 2"]}
            onSelect={setForecastMethodology}
          />
          {/* <NumberInput
            label="Number of Stocks"
            name="numberOfStocks"
            value={numberOfStocks}
            onNumberChange={handleNumberChange}
            min="3"
            max="20"
          /> */}
          {/* <ListButton onClick={handleListStocks} /> */}
        </div>
      </div>
      <StockList stocks={stocks} />
    </div>
  );
}

export default App;
