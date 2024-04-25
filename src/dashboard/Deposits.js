import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits(props) {
  return (
    <React.Fragment>
      <Title>Volume</Title>
      <Typography component="p" variant="h4">
        {props.stock[props.stock.length - 1].Volume}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on <br></br>
        {props.stock[props.stock.length - 1].Date}
      </Typography>
      <div>
        {/* <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link> */}
      </div>
    </React.Fragment>
  );
}
