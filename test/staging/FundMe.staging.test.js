const { assert, expect } = require("chai");
const { deployments, getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChain } = require("../../helper-hardhat-config");
// Unit testing of our fundme contract for Testing contract ------------------
developmentChain.includes(network.name) ? describe.skip :
    describe("*************** FundMe Contract testing on a testing chain network ************** ", async () => {
        let fundMe = null;
        let deployer = null;
        const sendValue = ethers.utils.parseEther("1")
        beforeEach(async () => {
            // Connecting with deployed Contract
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContract('FundMe', deployer)

        })

        // Testing funding and withdraw funcnality
        it("Allows people to fund and withdraw", async () => {
            await fundMe.fund({ value: sendValue })
            await fundMe.widraw()
            const endingbalance = await fundMe.provider.getBalance(fundMe.address)
            assert.equal(endingbalance.toString(), "0")
        })
    })