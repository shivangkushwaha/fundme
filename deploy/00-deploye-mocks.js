const { network } = require("hardhat");
const { verify } = require('../utills/verify');
const { networkConfig, developmentChain, BLOCKCONFORMATION, INITIAL_ANSWER, DECIMALS } = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUSDPriceFeeAddress;
    console.log("Network_name", network.name)
    if (developmentChain.includes(network.name)) {
        log("Local Network Detected! Deploying our smart Contract On it ----------")
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
            waitConformations: BLOCKCONFORMATION
        })
        log("Mock Contract Deployed SucCessfully")
        log("***********************************")

        const etherUsdAgreegator = await deployments.get("MockV3Aggregator")
        ethUSDPriceFeeAddress = etherUsdAgreegator.address
    }
    else {
        ethUSDPriceFeeAddress = networkConfig[chainId]["usdPriceFeeAddress"]
    }
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUSDPriceFeeAddress],
        log: true,
        waitConformations: BLOCKCONFORMATION
    })
    if (!developmentChain.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        //verify contract in chain 
        await verify(fundMe.address, [ethUSDPriceFeeAddress])
    }
    // when going for a local network or hardhat network we want to use a mock
    // deploye Fund Me Contract---

}

module.exports.tags = ["all", "mocks"]