import React, { useState, createContext } from "react";
import axios from "axios";

import { format, addDays } from "date-fns";

export const StocksDataContext = createContext();

export const StocksDataProvider = (props) => {
  // * Default currency is EUR
  const [stocks, setStocks] = useState([]);
  const [numberOfStocks, setNumberOfStocks] = useState(5);

  // * Mocky's test API
  // const url = "https://run.mocky.io/v3/06276abe-6134-444a-a100-83e0c8093bae";

  const url = "http://localhost:5000/fetch_stocks";

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  React.useEffect(() => {
    const handleListStocks = async () => {
      try {
        const response = await axios.post(url, {
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
        });
        setStocks(response.data);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    const today = new Date();
    const thirtyDaysAgo = addDays(today, -30);
    setStartDate(format(thirtyDaysAgo, "yyyy-MM-dd"));
    setEndDate(format(today, "yyyy-MM-dd"));

    // Async functions in React.useEffect must be done this way
    // (first the definition and then the invocation/call)
    handleListStocks();
  }, [startDate, endDate, numberOfStocks]);

  return (
    <StocksDataContext.Provider
      value={{
        stocks,
      }}
    >
      {props.children}
    </StocksDataContext.Provider>
  );
};
