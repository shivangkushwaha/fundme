const { assert, expect } = require("chai");
const { deployments, getNamedAccounts, ethers } = require("hardhat");


describe("FundMe", async () => {
    let fundMe = null;
    let deployer = null;
    let mockV3Aggregator = null;
    const sendValue = ethers.utils.parseEther("1")
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

    describe("fund Function Testing", () => {
        it("Fails if you don't send enough ethers", async () => {
            await expect(fundMe.fund()).to.be.revertedWith("You are not eligible yet for donate minimum amount of fund....")
        })
        it("Updates The Amount funded data Structure", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunder(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Add Funders to funders Array", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.funders(0)
            assert.equal(response, deployer)
        })
        describe("withdraw", async () => {
            beforeEach(async () => {
                await fundMe.fund({ value: sendValue })
            })
        })
        it("Withdraw ETH from a single founder", async () => {
            //Arrange
            const startingFundmebalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerbalance = await fundMe.provider.getBalance(deployer)
            // Act or Widraw functions
            const actionresponse = await fundMe.widraw();
            const transactionRecipt = await actionresponse.wait(1)
            // calculating Gas Cost for transaction
            const { gasUsed, effectivegasPrice } = transactionRecipt
            const gasCost = gasUsed.mul(effectivegasPrice)
            //Get Remaining Balance
            const endFundmebalance = await fundMe.provider.getBalance(fundMe.address)
            const endDeployerbalance = await fundMe.provider.getBalance(deployer)
            // Test 
            assert.equal(endFundmebalance, 0)
            assert.equal(startingFundmebalance.add(startingDeployerbalance).toString(), endDeployerbalance.toString())
        })
    })
})