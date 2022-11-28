const { network } = require("hardhat");
const { networkConfig, developmentChain, INITIAL_ANSWER, DECIMALS } = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    console.log("Network_name", network.name)
    if (developmentChain.includes(network.name)) {
        log("Local Network Detected! Deploying our smart Contract On it ----------")
        await deploy("MockV3Agreegator", {
            contract: "MockV3Agreegator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER]
        })
        log("Mock Contract Deployed SucCessfully")
        log("***********************************")
    }
    // when going for a local network or hardhat network we want to use a mock

}

module.exports.tags = ["all", "mocks"]