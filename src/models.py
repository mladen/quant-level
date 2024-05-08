from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class DailyStockPrice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(80), nullable=False)
    company_name = db.Column(db.String(255))
    date = db.Column(db.Date, nullable=False)
    avg_price = db.Column(db.Float)

    def __repr__(self):
        return f'<DailyStockPrice {self.ticker} ({self.company_name}) on {self.date}>'
