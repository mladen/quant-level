import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import DateInput from "./DateInput";
import ForecastMethodology from "./ForecastMethodology";
import InvestmentInput from "./InvestmentInput";
import NumberInput from "./NumberInput";
import DisplayFilter from "./DisplayFilter";
import ListButton from "./ListButton";
import StockList from "./StockList";

// Importing the Tabs, Tab, Typography, and Box components from Material-UI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// Importing the LineChart component (with dummy data for now) from the LineChart.js file
// import LineChart from "./components/LineChart";

// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
import CompanyQuickInfo from "./components/CompanyQuickInfo";

function App() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [forecastMethodology, setForecastMethodology] =
    useState("polynomial_2"); // Set 'Quadratic Polynomial Regression' as the default Forecast Methodology
  const [overallInvestmentBudget, setOverallInvestmentBudget] = useState(1000);
  const [stocks, setStocks] = useState([]);
  const [numberOfStocks, setNumberOfStocks] = useState(5);
  const [activeNumberOfStocks, setActiveNumberOfStocks] = useState(5);
  const [displayFilter, setDisplayFilter] = useState("Show all");

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleListStocks = async () => {
    const allTickers = [
      "AAPL",
      "AMZN",
      "BAC",
      "BRK-B",
      "DIS",
      "GOOGL",
      "HD",
      "JNJ",
      // "JPM",
      // "KO",
      // "MA",
      // "META",
      // "MSFT",
      // "NVDA",
      // "PG",
      // "TSLA",
      // "UNH",
      // "V",
      // "WMT",
      // "XOM",
    ];

    try {
      if (forecastMethodology === "random") {
        const selectedTickers = allTickers
          .sort(() => Math.random() - 0.5)
          .slice(0, numberOfStocks);
        const response = await axios.post(
          "http://localhost:5000/get_stock_prices",
          {
            startDate,
            endDate,
            tickers: selectedTickers,
          }
        );
        // Map to set forecast_price to null and then sort by ticker
        const updatedStocks = response.data
          .map((stock) => ({ ...stock, forecast_price: null }))
          .sort((a, b) => a.ticker.localeCompare(b.ticker));

        setStocks(updatedStocks); // Set the updated and sorted data to state
      } else if (forecastMethodology === "polynomial_2") {
        // Fetch initial stock prices for all tickers to have base data
        const baseResponse = await axios.post(
          "http://localhost:5000/get_stock_prices",
          {
            startDate,
            endDate,
            tickers: allTickers,
          }
        );
        // Fetch forecast data for all tickers
        const forecastResponse = await axios.post(
          "http://localhost:5000/forecast_stock_prices",
          {
            tickers: allTickers,
            start_date: startDate,
            forecast_date: endDate,
          }
        );
        // Map forecast data back to base data and sort by growth
        const mappedAndSortedStocks = baseResponse.data
          .map((stock) => ({
            ...stock,
            forecast_price:
              forecastResponse.data.find((f) => f.ticker === stock.ticker)
                ?.forecast_price || null,
            growth_percentage:
              forecastResponse.data.find((f) => f.ticker === stock.ticker)
                ?.growth_percentage || null,
          }))
          .sort((a, b) => b.growth_percentage - a.growth_percentage)
          .slice(0, numberOfStocks);

        setStocks(mappedAndSortedStocks); // Set sorted data with forecasts
      }
      setActiveNumberOfStocks(numberOfStocks);
    } catch (error) {
      console.error("Error fetching stocks or forecast data:", error);
    }
  };

  const handleNumberChange = (event) => {
    const number = parseInt(event.target.value, 10); // Convert input value to integer
    if (!isNaN(number) && number >= 2 && number <= 20) {
      setNumberOfStocks(number);
    }
  };

  return (
    <div className="App">
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            background: "#e5e5e5",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab label="Long Term Stock Value Prediction" {...a11yProps(0)} />
            <Tab label="Short Term Stock Value Prediction" {...a11yProps(1)} />
            <Tab label="Chat with PDFs (Balance Sheets)" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {/* New container for the three-column layout */}
          <div className="three-column-container">
            {/* Area 1: Dates */}
            <div className="column">
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

            {/* Area 2: Forecast Methodology and Display Filter */}
            <div className="column">
              <ForecastMethodology
                label="Forecast Methodology"
                onSelect={setForecastMethodology}
                selectedMethodology={forecastMethodology} // Pass the selected methodology as a prop
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
                min={2}
                max={20}
              />
              <div className="column-button">
                <ListButton onClick={handleListStocks} />
              </div>
            </div>
          </div>
          <StockList
            stocks={stocks}
            numberOfStocks={activeNumberOfStocks}
            overallInvestmentBudget={parseFloat(overallInvestmentBudget)}
            displayFilter={displayFilter}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <div className="three-column-container">
            <div className="column">
              {/* Print stocks */}
              <div>
                <h1>Today's prices of our stocks</h1>
                <ul>
                  {stocks.map((stock, index) => (
                    <li key={index}>
                      {stock.ticker} - {stock.forecast_price}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="column">
              {/* <LineChart /> */}
              <CompanyQuickInfo />
            </div>
            <div className="column">
              Third column for additional data and decision
            </div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Chat with PDF goes here, maybe, just maybe... :)
        </CustomTabPanel>
      </Box>
    </div>
  );
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default App;
