const ccxt = require('ccxt');
const axios = require('axios');

(async () => {
  const exchange = new ccxt.binance();
  
  try {
    const markets = await exchange.loadMarkets();
    
    for (const coin of Object.keys(markets)) {
      const symbol = markets[coin].symbol;
      
      // Fetch recent trades for the symbol
      const response = await axios.get(`https://api.binance.com/api/v3/trades`, {
        params: { symbol, limit: 100 },
      });
      
      const trades = response.data;
      
      // Calculate average price of recent trades
      const total = trades.reduce((sum, trade) => sum + parseFloat(trade.price), 0);
      const averagePrice = total / trades.length;
      
      console.log(`Average price of ${coin}:`, averagePrice);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
