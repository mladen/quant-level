from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import sqlite3

app = Flask(__name__)
CORS(app)

DATABASE = "stocks.db"

TICKERS = [
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
]


def create_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    # Create companies table
    c.execute(
        """CREATE TABLE IF NOT EXISTS companies
                 (ticker TEXT PRIMARY KEY, long_name TEXT)"""
    )

    # Create stock_prices table
    c.execute(
        """CREATE TABLE IF NOT EXISTS stock_prices
                 (ticker TEXT, date TEXT, open REAL, high REAL, low REAL, close REAL, volume REAL,
                 FOREIGN KEY (ticker) REFERENCES companies(ticker),
                 PRIMARY KEY (ticker, date))"""
    )

    conn.commit()
    conn.close()
    print("Database created successfully")

    # Calling the function to save stock data to the database
    save_stocks_to_db()


def save_stocks_to_db():
    tickers = TICKERS
    start_date = "2023-01-01"
    end_date = "2024-03-31"

    # Add one day to the end date using pandas
    end_date = pd.to_datetime(end_date) + pd.Timedelta(days=1)
    end_date = end_date.strftime(
        "%Y-%m-%d"
    )  # Convert back to string in YYYY-MM-DD format, as required by yfinance for date parameters

    results = []

    # Connect to SQLite database
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    for ticker in tickers:
        # Check if company info already exists in the database
        c.execute("SELECT * FROM companies WHERE ticker=?", (ticker,))
        company_info = c.fetchone()

        if not company_info:  # If company info does not exist, fetch and save it
            stock_info = yf.Ticker(ticker)
            long_name = stock_info.info["longName"]
            c.execute(
                "INSERT INTO companies (ticker, long_name) VALUES (?, ?)",
                (ticker, long_name),
            )
            conn.commit()

        # Fetch stock data from yfinance
        stock_info = yf.Ticker(ticker)
        stock_data = stock_info.history(start=start_date, end=end_date)
        if not stock_data.empty:
            stock_data.reset_index(inplace=True)
            stock_data["Ticker"] = ticker

            # Insert stock data into stock_prices table
            stock_data[["Date", "Open", "High", "Low", "Close", "Volume"]].to_sql(
                "stock_prices", conn, if_exists="append", index=False
            )

            conn.commit()

        print(f"Stock data for {ticker} saved successfully")
        print(stock_data.head())

        # Retrieve stock prices for the specified ticker and date range
        # c.execute(
        #     "SELECT * FROM stock_prices WHERE ticker=? AND date BETWEEN ? AND ?",
        #     (ticker, start_date, end_date),
        # )

        # Fetch all the rows from the result
        # fetched_data = c.fetchall()

        # Append the fetched data to the results list
        # results.append(
        #     [
        #         dict(zip(["date", "open", "high", "low", "close", "volume"], row[1:]))
        #         for row in fetched_data
        #     ]
        # )

    # conn.commit()
    conn.close()


@app.route("/fetch_stocks", methods=["POST"])
def fetch_stocks():
    data = request.json
    tickers = data["tickers"][: data["numberOfStocks"]]
    start_date = data["startDate"]
    end_date = data["endDate"]

    # Add one day to the end date using pandas
    end_date = pd.to_datetime(end_date) + pd.Timedelta(days=1)
    end_date = end_date.strftime(
        "%Y-%m-%d"
    )  # Convert back to string in YYYY-MM-DD format, as required by yfinance for date parameters

    results = []
    for ticker in tickers:
        stock_info = yf.Ticker(ticker)
        stock_data = stock_info.history(start=start_date, end=end_date)
        stock_data.reset_index(inplace=True)
        stock_data["Ticker"] = ticker
        stock_data["Name"] = stock_info.info[
            "longName"
        ]  # Get the full name of the company
        results.append(stock_data.to_dict(orient="records"))

    return jsonify(results)


if __name__ == "__main__":
    create_db()  # Create the database if not exists
    app.run(debug=True)
