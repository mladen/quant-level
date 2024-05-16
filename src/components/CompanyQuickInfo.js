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

        console.log(
          "getStockDataForPrevious14Days() response.data (companies and their stock info):",
          response.data
        );

        // Just prints out the xAxisValues for the LineChart
        let xAxisValues = Array.from(
          Array(response.data[0].prices.length).keys()
        ).map((num) => num + 1);
        console.log("xAxisValues", xAxisValues);

        // Just prints out the yAxisValues for the LineChart
        let yAxisValues = response.data[0].prices.map((price) =>
          parseFloat(price.avg_price)
        );
        console.log("yAxisValues", yAxisValues);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
    fetchStockData();
  }, []);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
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
            key={stock.ticker}
            xAxis={[
              {
                // data: stock.prices.map((price) => price.date),
                // data: Array.from(Array(stock.prices.length).keys()).map(
                //   (num) => num + 1
                // ),
                data: Array.from(
                  stock.prices.map((element, index) => parseInt(index + 1))
                ),
                tickInterval: Array.from(
                  stock.prices.map((element, index) => parseInt(index + 1))
                ),
                // data: stock.prices.map((element) => element.date),
                // dataKey: "date",
                scaleType: "time",
                // valueFormatter: (date) => new Date(date),
                valueFormatter: (date) => date.toString().split(" ")[0],
                // valueFormatter: (xAxisValues) => xAxisValues,
              },
            ]}
            series={[
              {
                type: "line",
                curve: "linear",
                data: stock.prices.map((price) => parseFloat(price.avg_price)),
                // name: stock.company_name,
                label: `${stock.company_name} stock value`,
                color: "#1976d2",
              },
              {
                type: "line",
                curve: "linear",
                data: stock.moving_avg.map((price) => parseFloat(price)),
                label: `${stock.company_name} moving average`,
                color: "gray",
              },
            ]}
            width={1000}
            height={400}
            grid={{ vertical: true, horizontal: true }}
          />
        ))}
      </div>
    </React.Fragment>
  );
}
