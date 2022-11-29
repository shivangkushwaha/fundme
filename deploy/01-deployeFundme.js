
const { networkConfig, BLOCKCONFORMATION, developmentChain } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require('../utills/verify');
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUSDPriceFeeAddress;
    console.log("Network_name", network.name)
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUSDPriceFeeAddress],
        log: true,
        waitConformations: BLOCKCONFORMATION
    })
    if (!developmentChain.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        //verify contract in chain 
        await verify(fundMe.address, [etherUsdAgreegator])
    }
}