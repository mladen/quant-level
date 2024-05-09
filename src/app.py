from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from datetime import date, datetime, timedelta
from models import db, DailyStockPrice
from forecast import polynomial_regression

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stocks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
CORS(app)

def fetch_and_store_stock_data():
    tickers = ['AAPL', 'AMZN', 'BAC', 'BRK-B', 'DIS', 'GOOGL', 'HD', 'JNJ', 'JPM', 'KO', 'MA', 'META', 'MSFT', 'NVDA', 'PG', 'TSLA', 'UNH', 'V', 'WMT', 'XOM']
    end_date = date.today()

    for ticker in tickers:
        last_data_point = DailyStockPrice.query.filter_by(ticker=ticker).order_by(DailyStockPrice.date.desc()).first()
        start_date = last_data_point.date + timedelta(days=1) if last_data_point else date(2021, 1, 1)

        if start_date > end_date:
            print(f"All data up to date for {ticker}.")
            continue

        print(f"Fetching data for {ticker} from {start_date} to {end_date}")
        stock_info = yf.Ticker(ticker)
        stock_data = stock_info.history(start=start_date.strftime("%Y-%m-%d"), end=end_date.strftime("%Y-%m-%d"))

        for index, row in stock_data.iterrows():
            daily_data = DailyStockPrice(
                ticker=ticker,
                company_name=stock_info.info.get('longName'),
                date=index.date(),
                avg_price=(row['Open'] + row['Close']) / 2
            )
            db.session.add(daily_data)
        db.session.commit()

@app.route('/get_stock_prices', methods=['POST'])
def get_stock_prices():
    data = request.json
    tickers = data['tickers']
    start_date = datetime.strptime(data['startDate'], '%Y-%m-%d').date()
    end_date = datetime.strptime(data['endDate'], '%Y-%m-%d').date()
    
    results = []
    for ticker in tickers:
        start_price = DailyStockPrice.query.filter_by(ticker=ticker, date=start_date).first()
        end_price = DailyStockPrice.query.filter_by(ticker=ticker, date=end_date).first()
        
        if start_price and end_price:
            result = {
                'ticker': ticker,
                'company_name': start_price.company_name,
                'start_avg': f"{start_price.avg_price:.2f}",
                'end_avg': f"{end_price.avg_price:.2f}"
            }
            results.append(result)
    
    return jsonify(results if results else {'error': 'Data not found'}), (200 if results else 404)

@app.route('/forecast_stock_prices', methods=['POST'])
def forecast_stock_prices():
    data = request.json
    tickers = data.get('tickers')
    start_date = data.get('start_date')
    forecast_date = data.get('forecast_date')
    method = data.get('method')

    if not tickers or not start_date or not forecast_date:
        return jsonify({'error': 'Missing data in request'}), 400

    try:
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        forecast_date = datetime.strptime(forecast_date, '%Y-%m-%d').date()
        if method == 'linear':
            degree = 1  # Linear regression
        elif method == 'polynomial_2':
            degree = 2  # Quadratic regression
        elif method == 'polynomial_3':
            degree = 3  # Cubic regression
        results = polynomial_regression(tickers, start_date, forecast_date, degree)
    except ValueError as e:
        return jsonify({'error': 'Invalid date format', 'details': str(e)}), 400

    return jsonify(results if results else {'error': 'No data available for forecasting'}), (200 if results else 404)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        fetch_and_store_stock_data()
    app.run(debug=True)
