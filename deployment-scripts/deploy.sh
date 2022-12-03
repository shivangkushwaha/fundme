# Running Hardhat Node
cd C:/Users/91935/Desktop/blockchain-notes/Code/git/fundme
npx hardhat node
sleep 10

# Deploy contract On Local Chain and Fund
cd C:/Users/91935/Desktop/blockchain-notes/Code/git/fundme/scripts
npx hardhat run fund.js --network "localhost"
sleep 2

#withdraw all fund From Contract
cd C:/Users/91935/Desktop/blockchain-notes/Code/git/fundme/scripts
npx hardhat run widraw.js --network "localhost"