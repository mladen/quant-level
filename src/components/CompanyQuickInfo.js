// import * as React from "react";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { LineChart } from "@mui/x-charts/LineChart";

import axios from "axios";

// [
//   {
//     company_name: "Apple Inc."
//     prices: [{avg_price: "173.19", date: "2024-03-12"}, {avg_price: "171.95", date: "2024-03-13"},…]
//     ticker: "AAPL"
//   }
//   ]

export default function StockChart(props) {
  const [stockData, setStockData] = useState([]);

  const getStockDataForPrevious14Days = async () => {
    // const url = `https://api.example.com/stockData?startDate=${startDateISO}&endDate=${endDate}`;
    const url = `http://localhost:5000/get_stock_data_for_previous_14_days`;
    return axios.get(url);
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        console.log("test");
        const response = await getStockDataForPrevious14Days();
        setStockData(response.data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
    fetchStockData();
  }, []);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Stock Data for Last 14 Days
        {/* Print out prices for each day for each stock */}
        {/* {stockData.map((stock, index) => (
          <div key={`${stock.ticker}-${index}`}>
            <h2>{stock.company_name}</h2>
            {stock.prices.map((price) => (
              <div key={price.date}>
                <p>{price.date}</p>
                <p>{price.avg_price}</p>
              </div>
            ))}
          </div>
        ))} */}
      </Typography>
      <div style={{ width: "100%" }}>
        {/* Create a LineChart for each stock in stockData */}
        {stockData.map((stock, index) => (
          <LineChart
            key={stock.ticker + index}
            xAxis={[
              {
                // data: stock.prices.map((price) => price.date),
                data: Array.from(Array(stock.prices.length).keys()).map(
                  (num) => num + 1
                ),
                // dataKey: "date",
              },
            ]}
            series={[
              {
                type: "line",
                data: stock.prices.map((price) => parseFloat(price.avg_price)),
                // name: stock.company_name,
              },
            ]}
            width={1000}
            height={400}
          />
        ))}
      </div>
    </React.Fragment>
  );
}
