import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

import { format, addDays } from "date-fns";

export default function SimpleLineChart(props) {
  // Extract Date from all the stock data from props
  // const xLabels = props.stock.map((u) => format(new Date(u.Date), "dd.MM."));

  // Return Dates for the previous 2 weeks
  const xLabels = props.stock
    .slice(-14)
    .map((u) => format(new Date(u.Date), "dd.MM."));

  // const priceData = props.stock.map(
  //   (u) => Math.round((u.Close + Number.EPSILON) * 100) / 100
  // );

  // Return Close price for the last 2 weeks
  const priceData = props.stock.slice(-14).map((u) => u.Close);
  let movingAverageData = [];
  let movingAverageDataPoint = 0;

  // Calculate moving average for the last 2 weeks
  // for (let i = 0; i < props.stock.length; i++) {
  //   if (i > 0) {
  //     movingAverageDataPoint =
  //       Math.abs(props.stock[i].Close + props.stock[i - 1].Close) / 2;

  //     movingAverageData.push(movingAverageDataPoint);
  //   } else {
  //     movingAverageData.push(props.stock[i].Close);
  //   }
  // }
  // console.log(movingAverageData);
  // console.log(movingAverageData);

  // for (let i = 0; i < priceData.length; i++) {
  //   if (i > 0) {
  //     movingAverageDataPoint = Math.abs(priceData[i] + priceData[i - 1]) / 2;

  //     movingAverageData.push(movingAverageDataPoint);
  //   } else {
  //     movingAverageData.push(priceData[i]);
  //   }

  return (
    <LineChart
      // style={{ width: "100%", flexGrow: 1, overflow: "hidden" }}
      // width={500}
      height={300}
      series={[
        {
          data: priceData,
          label: `${props.stock[0].Name} (Ticker: ${props.stock[0].Ticker})`,
          color: "blue",
        },
        // {
        //   data: movingAverageData,
        //   label: "Moving average",
        //   color: "lightblue",
        // },
      ]}
      xAxis={[{ scaleType: "point", data: xLabels }]}
    />
  );
}
