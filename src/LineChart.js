import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

import { format, addDays } from "date-fns";

export default function SimpleLineChart(props) {
  // Extract Date from all the stock data from props
  const xLabels = props.stock.map((u) => format(new Date(u.Date), "dd.MM."));
  const priceData = props.stock.map(
    (u) => Math.round((u.Close + Number.EPSILON) * 100) / 100
  );

  let movingAverageData = [];
  let movingAverageDataPoint = 0;

  for (let i = 0; i < priceData.length; i++) {
    if (i > 0) {
      movingAverageDataPoint = Math.abs(priceData[i] + priceData[i - 1]) / 2;

      movingAverageData.push(movingAverageDataPoint);
    } else {
      movingAverageData.push(priceData[i]);
    }
  }

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
        {
          data: movingAverageData,
          label: "Moving average",
          color: "lightblue",
        },
      ]}
      xAxis={[{ scaleType: "point", data: xLabels }]}
    />
  );
}
