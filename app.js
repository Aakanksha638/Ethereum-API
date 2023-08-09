const express = require('express');
const ethers = require('ethers');

const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Route 1: Validate Ethereum Wallet Address
app.post('/validate', (req, res) => {
  const { address } = req.body;

  try {
    // Attempt to create an Ethereum address instance
    ethers.utils.getAddress(address);

    // If getAddress does not throw an error, the address is valid
    res.json({ isValid: true });
  } catch (error) {
    // getAddress will throw an error for an invalid address
    res.json({ isValid: false });
  }
});

// Route 2: Create a new Ethereum Wallet
app.get('/create-wallet', (req, res) => {
  const wallet = ethers.Wallet.createRandom();
  res.json({
    address: wallet.address,
    privateKey: wallet.privateKey
  });
});

// Route 3: Get Latest 1000 Ethereum Transactions
app.get('/latest-transactions', async (req, res) => {
  try {
    const provider = ethers.getDefaultProvider(); // Use default Ethereum provider

    // Get latest block number
    const blockNumber = await provider.getBlockNumber();

    // Get transactions from the latest 1000 blocks
    const transactions = [];
    for (let i = blockNumber; i > blockNumber - 1000; i--) {
      const block = await provider.getBlockWithTransactions(i);
      transactions.push(...block.transactions);
    }

    // Sort transactions by ether amount
    transactions.sort((a, b) => {
      return ethers.utils.bigNumberify(b.value).sub(ethers.utils.bigNumberify(a.value));
    });

    // Extract relevant data from transactions
    const formattedTransactions = transactions.map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: ethers.utils.formatEther(tx.value),
      blockNumber: tx.blockNumber
    }));

    res.json(formattedTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
