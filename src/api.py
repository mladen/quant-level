from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/fetch_stocks', methods=['POST'])
def fetch_stocks():
    data = request.json
    tickers = data['tickers'][:data['numberOfStocks']]
    start_date = data['startDate']
    end_date = data['endDate']

    # Add one day to the end date using pandas
    end_date = pd.to_datetime(end_date) + pd.Timedelta(days=1)
    end_date = end_date.strftime('%Y-%m-%d')  # Convert back to string in YYYY-MM-DD format, as required by yfinance for date parameters

    results = []
    for ticker in tickers:
        stock_info = yf.Ticker(ticker)
        stock_data = stock_info.history(start=start_date, end=end_date)
        stock_data.reset_index(inplace=True)
        stock_data['Ticker'] = ticker
        stock_data['Name'] = stock_info.info['longName']  # Get the full name of the company
        results.append(stock_data.to_dict(orient='records'))

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
