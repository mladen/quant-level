from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
import numpy as np
from models import DailyStockPrice, db

def calculate_percentage_growth(current_price, forecast_price):
    return ((forecast_price - current_price) / current_price) * 100

def polynomial_regression(tickers, start_date, forecast_date, degree=2):
    results = []
    for ticker in tickers:
        stock_prices = db.session.query(DailyStockPrice)\
                                 .filter(DailyStockPrice.ticker == ticker)\
                                 .filter(DailyStockPrice.date <= start_date)\
                                 .order_by(DailyStockPrice.date).all()

        if not stock_prices:
            continue

        dates = np.array([(price.date - stock_prices[0].date).days for price in stock_prices]).reshape(-1, 1)
        prices = np.array([price.avg_price for price in stock_prices])

        poly = PolynomialFeatures(degree=degree)
        X_poly = poly.fit_transform(dates)
        model = LinearRegression()
        model.fit(X_poly, prices)

        future_date = (forecast_date - stock_prices[0].date).days
        future_price = model.predict(poly.transform([[future_date]]))[0]

        current_price = prices[-1]  # Last known price in the training set
        growth_percentage = calculate_percentage_growth(current_price, future_price)

        results.append({
            'ticker': ticker,
            'current_price': current_price,
            'forecast_price': round(future_price, 2),
            'growth_percentage': round(growth_percentage, 2)
        })

    return results

