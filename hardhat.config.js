

require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-gas-reporter')
require('dotenv').config()
require("./tasks/blockNumber")
require("solidity-coverage")
require("hardhat-deploy")
/** @type import('hardhat/config').HardhatUserConfig */

const COIN_MARKET_CAP_API_KEY = process.env.COIN_MARKET_CAP_API_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const GOERLI_NETWORK_URL = process.env.GOERLI_NETWORK_URL

module.exports = {
  // solidity: "0.8.17",
  solidity: {
    compilers: [{ version: "0.6.6" }, { version: "0.8.17" }, { version: "0.8.0" }]
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  defaultNetwork: "hardhat",
  networks: {
    "goerli": {
      url: GOERLI_NETWORK_URL,
      accounts: [
        PRIVATE_KEY
      ],
      chainId: 5
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    }
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketca: COIN_MARKET_CAP_API_KEY
  },
  namedAccounts: {
    deployer: 0
  }
};
