const ccxt = require('ccxt');

(async () => {
  const exchange = new ccxt.binance();
  
  try {
    const markets = await exchange.loadMarkets();
    
    const tradableCoins = Object.keys(markets);
    
    console.log('Tradable Coins on Binance:', tradableCoins);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
