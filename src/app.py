from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import yfinance as yf
from datetime import date, datetime, timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stocks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

class DailyStockPrice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(80), nullable=False)
    company_name = db.Column(db.String(255))
    date = db.Column(db.Date, nullable=False)
    avg_price = db.Column(db.Float)

    def __repr__(self):
        return f'<DailyStockPrice {self.ticker} ({self.company_name}) on {self.date}>'

def fetch_and_store_stock_data():
    tickers = ['AAPL', 'AMZN', 'BAC', 'BRK-B', 'DIS', 'GOOGL', 'HD', 'JNJ', 'JPM', 'KO', 'MA', 'META', 'MSFT', 'NVDA', 'PG', 'TSLA', 'UNH', 'V', 'WMT', 'XOM']
    end_date = date.today()

    for ticker in tickers:
        # Check the last date for which data was stored
        last_data_point = DailyStockPrice.query.filter_by(ticker=ticker).order_by(DailyStockPrice.date.desc()).first()
        if last_data_point:
            start_date = last_data_point.date + timedelta(days=1)  # Start from the next day after the last stored date
        else:
            start_date = date(2023, 1, 1)  # If no data found, use a default start date
        
        if start_date > end_date:
            print(f"All data up to date for {ticker}.")
            continue  # Skip this ticker if the start date is beyond the end date

        print(f"Fetching data for {ticker} from {start_date} to {end_date}")
        stock_info = yf.Ticker(ticker)
        stock_data = stock_info.history(start=start_date.strftime("%Y-%m-%d"), end=end_date.strftime("%Y-%m-%d"))

        company_name = stock_info.info.get('longName')  # Retrieve the company name
        if not stock_data.empty:
            for index, row in stock_data.iterrows():
                daily_data = DailyStockPrice(
                    ticker=ticker,
                    company_name=company_name,
                    date=index.date(),
                    avg_price=(row['Open'] + row['Close']) / 2
                )
                db.session.add(daily_data)
                print(f"Adding to session: {daily_data}")
            db.session.commit()
            print(f"Data for {ticker} committed to the database.")
        else:
            print(f"No data found for {ticker} between {start_date} and {end_date}")


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
    
    if results:
        return jsonify(results)
    else:
        return jsonify({'error': 'Data not found'}), 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        fetch_and_store_stock_data()
    app.run(debug=True)
