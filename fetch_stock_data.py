import yfinance as yf

def fetch_and_save_stock_data(tickers, start_date, end_date):

    """
    Fetches historical stock data for a list of tickers from Yahoo Finance and saves each ticker's data to a separate CSV file.

    This function is designed to assist in the analysis and backtesting of stock market strategies by providing easy access to historical data.
    
    It loops through a list of stock ticker symbols, downloads the data for the specified date range, and saves this data into individual CSV files named after each ticker.
    
    This setup enables separate and efficient data handling for each stock.

    Parameters:
    tickers (list of str): A list of ticker symbols for which historical data is to be downloaded.
    start_date (str): The start date for the data download (inclusive), formatted as 'YYYY-MM-DD'.
    end_date (str): The end date for the data download (inclusive), formatted as 'YYYY-MM-DD'.

    Returns:
    None. Outputs data to CSV files.
    """
    for ticker in tickers:
        # Fetch stock data
        stock_data = yf.download(ticker, start=start_date, end=end_date)

        # Filename for CSV
        filename = f"{ticker}.csv"

        # Save data to CSV
        stock_data.to_csv(filename)
        print(f"Data for {ticker} saved to {filename}")

# List of popular stock tickers
popular_tickers = [
    'AAPL',  # Apple
    'AMZN',  # Amazon
    'BAC',   # Bank of America
    'BRK-B', # Berkshire Hathaway
    'DIS',   # Disney
    'GOOGL', # Alphabet
    'HD',    # Home Depot
    'JNJ',   # Johnson & Johnson
    'JPM',   # JPMorgan Chase
    'KO',    # Coca-Cola
    'MA',    # Mastercard
    'META',  # Meta Platforms (formerly Facebook)
    'MSFT',  # Microsoft
    'NVDA',  # Nvidia
    'PG',    # Procter & Gamble
    'TSLA',  # Tesla
    'UNH',   # UnitedHealth
    'V',     # Visa
    'WMT',   # Walmart
    'XOM',   # Exxon Mobil
]

start_date = '2023-01-01'
end_date = '2024-04-17'

fetch_and_save_stock_data(popular_tickers, start_date, end_date)
