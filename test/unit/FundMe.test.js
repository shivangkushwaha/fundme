const { assert } = require("chai");
const { deployments, getNamedAccounts, ethers } = require("hardhat");


describe("FundMe", async () => {
    let fundMe = null;
    let deployer = null;
    let mockV3Aggregator = null;
    beforeEach(async () => {
        //deploye fundme
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract('FundMe', deployer)
        mockV3Aggregator = await ethers.getContract('MockV3Aggregator', deployer)
    })
    describe("constroctor", async () => {
        it("Set the aggregator correctly", async () => {
            const response = await fundMe.priceFeed();
            assert.equal(response, mockV3Aggregator.address)
        })
    })
})