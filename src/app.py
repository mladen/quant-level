from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from datetime import date, datetime, timedelta
from models import db, DailyStockPrice
from forecast import polynomial_regression

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///stocks.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
CORS(app)

tickers = [
    "AAPL",
    "AMZN",
    # "BAC",
    # "BRK-B",
    # "DIS",
    # "GOOGL",
    # "HD",
    # "JNJ",
    # "JPM",
    # "KO",
    # "MA",
    # "META",
    # "MSFT",
    # "NVDA",
    # "PG",
    # "TSLA",
    # "UNH",
    # "V",
    # "WMT",
    # "XOM",
]


def fetch_and_store_stock_data():

    end_date = date.today()

    for ticker in tickers:
        last_data_point = (
            DailyStockPrice.query.filter_by(ticker=ticker)
            .order_by(DailyStockPrice.date.desc())
            .first()
        )
        start_date = (
            last_data_point.date + timedelta(days=1)
            if last_data_point
            else date(2021, 1, 1)
        )

        if start_date > end_date:
            print(f"All data up to date for {ticker}.")
            continue

        print(f"Fetching data for {ticker} from {start_date} to {end_date}")
        stock_info = yf.Ticker(ticker)
        stock_data = stock_info.history(
            start=start_date.strftime("%Y-%m-%d"), end=end_date.strftime("%Y-%m-%d")
        )

        for index, row in stock_data.iterrows():
            daily_data = DailyStockPrice(
                ticker=ticker,
                company_name=stock_info.info.get("longName"),
                date=index.date(),
                avg_price=(row["Open"] + row["Close"]) / 2,
            )
            db.session.add(daily_data)
        db.session.commit()


@app.route("/get_stock_prices", methods=["POST"])
def get_stock_prices():
    data = request.json
    tickers = data["tickers"]
    start_date = datetime.strptime(data["startDate"], "%Y-%m-%d").date()
    end_date = datetime.strptime(data["endDate"], "%Y-%m-%d").date()

    results = []
    for ticker in tickers:
        start_price = DailyStockPrice.query.filter_by(
            ticker=ticker, date=start_date
        ).first()
        end_price = DailyStockPrice.query.filter_by(
            ticker=ticker, date=end_date
        ).first()

        # Format the date into DD.MM. format
        formatted_date = start_date.strftime("%d.%m.")

        if start_price and end_price:
            result = {
                "ticker": ticker,
                "company_name": start_price.company_name,
                "start_avg": f"{start_price.avg_price:.2f}",
                "end_avg": f"{end_price.avg_price:.2f}",
                "date": f"{formatted_date}",
            }
            results.append(result)

    return jsonify(results if results else {"error": "Data not found"}), (
        200 if results else 404
    )


@app.route("/forecast_stock_prices", methods=["POST"])
def forecast_stock_prices():
    data = request.json
    if (
        not data
        or "tickers" not in data
        or "start_date" not in data
        or "forecast_date" not in data
    ):
        return jsonify({"error": "Missing data in request"}), 400

    tickers = data["tickers"]
    try:
        start_date = datetime.strptime(data["start_date"], "%Y-%m-%d").date()
        forecast_date = datetime.strptime(data["forecast_date"], "%Y-%m-%d").date()
    except ValueError as e:
        return jsonify({"error": "Invalid date format", "details": str(e)}), 400

    results = polynomial_regression(tickers, start_date, forecast_date)
    return jsonify(
        results if results else {"error": "No data available for forecasting"}
    ), (200 if results else 404)


# Get the stock data for the previous 14 days
@app.route("/get_stock_data_for_previous_14_days", methods=["GET"])
def get_stock_data_for_previous_14_days():
    today = date.today()
    two_months_ago = today - timedelta(days=14)

    stock_data = DailyStockPrice.query.filter(
        DailyStockPrice.date >= two_months_ago, DailyStockPrice.ticker.in_(tickers)
    ).all()

    print(stock_data)

    results = []
    ticker_dict = {}

    for data in stock_data:
        if data.ticker not in ticker_dict:
            ticker_dict[data.ticker] = {
                "company_name": data.company_name,
                "ticker": data.ticker,
                "prices": [],
                "moving_avg": [],
            }

        price_info = {
            "avg_price": f"{data.avg_price:.2f}",
            # "date": data.date.strftime("%Y-%m-%d"),
            "date": data.date.strftime("%d.%m.%Y"),
        }

        # Moving average info
        moving_avg = (
            DailyStockPrice.query.filter(
                DailyStockPrice.date < data.date,
                DailyStockPrice.ticker == data.ticker,
            )
            .order_by(DailyStockPrice.date.desc())
            .limit(5)
        )

        ticker_dict[data.ticker]["prices"].append(price_info)
        ticker_dict[data.ticker]["moving_avg"].append(
            f"{sum([x.avg_price for x in moving_avg]) / 5:.2f}"
        )

    results = list(ticker_dict.values())

    return jsonify(results)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        fetch_and_store_stock_data()
    app.run(debug=True)
