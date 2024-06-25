# Quant level

- [Quant level](#quant-level)
  - [Description](#description)
  - [Technologies](#technologies)
  - [Setup instructions](#setup-instructions)
  - [Features](#features)
  - [Current Development Status](#current-development-status)
  - [Known Bugs](#known-bugs)

## Description

This web application leverages React and Flask to offer a dynamic interface for performing stock market analysis based on various forecasting methodologies. It allows users to analyze stock performance over specified periods and forecast future trends using advanced mathematical models.

![Quant Level App Screenshot](public/images/screenshot.png)

## Technologies

- **Frontend**: Developed using React.js, it provides a responsive and interactive user interface.
- **Backend**: Flask serves as the backend framework, handling API requests and integrating with a SQLite database for data storage.
- **Database**: SQLite, managed with SQLAlchemy for ORM-based data interactions.
- **Data Source**: Stock data is fetched using the Yahoo Finance API via the `yfinance` package.

## Setup instructions

1. Clone the repository

2. Install the required dependencies

   - For the backend:
     - Install virtualenv: `pip3 install virtualenv`
     - Create a virtual environment: `python3 -m venv env`
     - Activate the virtual environment:
       - Windows: `env\Scripts\activate`
       - Linux: `source env/bin/activate`
     - Install the required dependencies: `pip install -r requirements.txt`

   - For the frontend:
     - Install Node.js and npm if you haven't already
     - Install the required dependencies: `npm install`

  > NOTE: If we want requirements.txt to be automatically generated, we can use the following command:
  > - `pip freeze > requirements.txt` (not recommended)
  > - use pipreqs: `pip install pipreqs` and then `pipreqs /path/to/project` (recommended)
  >   - check out [this tutorial](https://builtin.com/software-engineering-perspectives/pip-freeze) or the official [pipreqs documentation](https://pypi.org/project/pipreqs/) for more information

1. Run the application

   - For the backend:
     - Start the Flask server (execute this command in the root directory of the project):
       - Windows: `python src\app.py` or `env\Scripts\python.exe src\app.py`
       - Linux: `python3 src/app.py`
   - For the frontend (execute this command in the root directory of the project):
     - Run the React application:
       - Windows/Linux: `npm run start`

## Features

- **Interactive Date Selection**: Users can select start and end dates to specify the period for stock analysis.
- **Multiple Forecast Methodologies**:
  - **Random Selection**: Stocks are randomly selected and presented without any forecasting.
  - **Linear Regression**: Provides a straightforward trend analysis using a first-degree polynomial.
  - **Quadratic Polynomial Regression**: Stocks are analyzed and forecasted using a second-degree polynomial regression model.
  - **Cubic Polynomial Regression**: Analyzes stocks using a third-degree polynomial for more complex trend forecasting.
- **Investment Budget Input**: Users can input their overall investment budget to see how it could be distributed across different stocks.
- **Dynamic Stock Number Selection**: Users can decide how many stocks they want to analyze and see the forecast for.
- **Display Filters**: Stocks can be filtered to show all, winners, or losers based on performance.

## Current Development Status

Additional features are being developed on the `adding-front-library-and-short-term-prediction-algos` branch of this repository. We expect to merge these updates into the main project shortly.

## Known Bugs

- **Non-working days issue**: The application may encounter errors if the selected start or end date falls on a non-working day for the stock market, such as weekends or public holidays. This occurs because the app tries to fetch stock data on days when the market is closed. We are working to resolve this issue. Until then, please ensure to choose dates that are regular trading days.
