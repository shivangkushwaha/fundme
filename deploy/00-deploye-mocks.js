const { network } = require("hardhat");
const { verify } = require('../utills/verify');
const { networkConfig, developmentChain, INITIAL_ANSWER, DECIMALS } = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUSDPriceFeeAddress;
    console.log("Network_name", network.name)
    if (developmentChain.includes(network.name)) {
        const etherUsdAgreegator = await deployments.get("MockV3Agreegator")
        ethUSDPriceFeeAddress = etherUsdAgreegator.address
        // log("Local Network Detected! Deploying our smart Contract On it ----------")
        // await deploy("MockV3Agreegator", {
        //     from: deployer,
        //     log: true,
        //     args: [DECIMALS, INITIAL_ANSWER]
        // })
        // log("Mock Contract Deployed SucCessfully")
        // log("***********************************")
    }
    else {
        ethUSDPriceFeeAddress = networkConfig[chainId]["usdPriceFeeAddress"]
    }

    // when going for a local network or hardhat network we want to use a mock
    // deploye Fund Me Contract---

}

module.exports.tags = ["all", "mocks"]