import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

const priceData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
// const movingAverageData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
// movingAverageData is sum of priceData divided by the length of priceData
// let movingAverageData = priceData.map((u) => u / priceData.length);
let movingAverageData = [];
let movingAverageDataPoint = 0;

for (let i = 0; i < priceData.length; i++) {
  // console.log(priceData[i]);
  if (i > 0) {
    movingAverageDataPoint = Math.abs(priceData[i] + priceData[i - 1]) / 2;

    movingAverageData.push(movingAverageDataPoint);
  } else {
    movingAverageData.push(priceData[i]);
  }
}
//console.log(movingAverageData);
//const movingAverageData =

const xLabels = [
  "17.04.2024.",
  "18.04.2024.",
  "19.04.2024.",
  "20.04.2024.",
  "21.04.2024.",
  "22.04.2024.",
  "23.04.2024.",
];

export default function SimpleLineChart() {
  return (
    <LineChart
      // style={{ width: "100%", flexGrow: 1, overflow: "hidden" }}
      // width={500}
      height={300}
      series={[
        {
          data: priceData,
          label: "Alphabet Inc. Class A",
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
