
const { networkConfig } = require("../helper-hardhat-config");
const { network } = require('hardhat')
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // when going for a local network or hardhat network we want to use a mock

}