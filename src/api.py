from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd

app = Flask(__name__)
CORS(app)

# Placeholder function for filtering based on performance
def filter_stocks_by_performance(stock_data, display_filter):
    # Implement the logic to filter winners, losers, or show all
    # This is just a placeholder and needs proper implementation
    if display_filter == 'Show winners':
        # Logic for filtering winners
        pass
    elif display_filter == 'Show losers':
        # Logic for filtering losers
        pass
    # Default is to show all, so no action needed
    return stock_data

@app.route('/fetch_stocks', methods=['POST'])
def fetch_stocks():
    data = request.json
    tickers = data['tickers'][:data['numberOfStocks']]
    start_date = data['startDate']
    end_date = data['endDate']

    # Add one day to the end date using pandas
    end_date = pd.to_datetime(end_date) + pd.Timedelta(days=1)
    end_date = end_date.strftime('%Y-%m-%d')  # Convert back to string in YYYY-MM-DD format, as required by yfinance for date parameters

    # Add handling for display filter
    display_filter = data['displayFilter']

    results = []
    for ticker in tickers:
        stock_info = yf.Ticker(ticker)
        stock_data = stock_info.history(start=start_date, end=end_date)
        stock_data.reset_index(inplace=True)
        stock_data['Ticker'] = ticker
        stock_data['Name'] = stock_info.info['longName']  # Get the full name of the company
        # results.append(stock_data.to_dict(orient='records'))

        # Apply the display filter
        filtered_data = filter_stocks_by_performance(stock_data, display_filter)
        results.append(filtered_data.to_dict(orient='records'))

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
