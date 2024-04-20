from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)

@app.route('/fetch_stocks', methods=['POST'])
def fetch_stocks():
    data = request.json
    tickers = data['tickers'][:data['numberOfStocks']]
    start_date = data['startDate']
    end_date = data['endDate']

    results = []
    for ticker in tickers:
        stock_data = yf.download(ticker, start=start_date, end=end_date)
        stock_data['Ticker'] = ticker
        results.append(stock_data.to_dict(orient='records'))

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
