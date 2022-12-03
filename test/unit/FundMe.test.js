const { assert, expect } = require("chai");
const { deployments, getNamedAccounts, ethers } = require("hardhat");

// Unit testing of our fundme contract for Testing contract ------------------
describe("*************** FundMe Contract testing ************** ", async () => {
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
    describe("Testing Constroctor", async () => {

        // Testign Constructor of contract -----
        it("Set the aggregator correctly", async () => {
            const response = await fundMe.s_priceFeed();
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    // All functions testing of our contract ----
    describe("Fund Functionality Testing", () => {

        // Case 1 
        it("Fails if you don't send enough ethers", async () => {
            await expect(fundMe.fund()).to.be.revertedWith("You are not eligible yet for donate minimum amount of fund....")
        })

        //case 2  
        it("Updates The Amount funded data Structure", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.s_addressToAmountFunder(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })

        //Case 3 
        it("Add Funders to funders Array", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.s_funders(0)
            assert.equal(response, deployer)
        })

        // Tesign withdraw Function 
        describe("withdraw", async () => {
            beforeEach(async () => {
                await fundMe.fund({ value: sendValue })
            })
        })
        // case 1----
        it("Withdraw ETH from a single founder", async () => {

            //Arrange
            const startingFundmebalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerbalance = await fundMe.provider.getBalance(deployer)

            // Act or Widraw functions
            const actionresponse = await fundMe.widraw();
            const transactionRecipt = await actionresponse.wait(1)

            // calculating Gas Cost for transaction
            const { gasUsed, effectiveGasPrice } = transactionRecipt
            const gasCost = gasUsed.mul(effectiveGasPrice.toString())

            //Get Remaining Balance
            const endFundmebalance = await fundMe.provider.getBalance(fundMe.address)
            const endDeployerbalance = await fundMe.provider.getBalance(deployer)

            // Test 
            assert.equal(endFundmebalance, 0)
            assert.equal(startingFundmebalance.add(startingDeployerbalance).toString(), endDeployerbalance.add(gasCost).toString())
        })

        // Case 2----
        it("Alloes us to withdraw multiple Funders", async () => {

            // Getting all different accounts from our local chain -----
            const accounts = await ethers.getSigners();
            for (const i of accounts) {

                // Connecting account to our contract for making transaction(calling fund function from it.)
                const fundMeConnectedContract = await fundMe.connect(i)
                await fundMeConnectedContract.fund({ value: sendValue })

                // calculating starting (initial balance for the contracts)
                const startingFundmebalance = await fundMe.provider.getBalance(fundMe.address)
                const startingDeployerbalance = await fundMe.provider.getBalance(deployer)

                // make transaction to send amount to smart contract ----
                const actionresponse = await fundMe.widraw();
                const transactionRecipt = await actionresponse.wait(1)

                // calculating Gas Cost for transaction
                const { gasUsed, effectiveGasPrice } = transactionRecipt
                const gasCost = gasUsed.mul(effectiveGasPrice.toString())

                //Calculating balance after making transaction
                const endFundmebalance = await fundMe.provider.getBalance(fundMe.address)
                const endDeployerbalance = await fundMe.provider.getBalance(deployer)

                // validating all balances for contract and the account balancers
                assert.equal(endFundmebalance, 0)
                assert.equal(startingFundmebalance.add(startingDeployerbalance).toString(), endDeployerbalance.add(gasCost).toString())

                // check funders array is reseted to inital position after withdraw all amount from my contract ---

                await expect(fundMe.s_funders(0)).to.be.reverted
                // Checking all mappings are updated correctly -------
                for (const account of accounts) {
                    assert.equal(await fundMe.s_addressToAmountFunder(account.address), 0)
                }
            }
        })

        //Only Owner can Withdraw --
        it("Only allows owner To Withdraw", async () => {

            //Getting a dummy attacker account
            const accounts = await ethers.getSigners();
            const attacker = accounts[1]

            // trying to attack
            const attckerConnected = await fundMe.connect(attacker)
            await expect(attckerConnected.widraw()).to.be.reverted

        })

        // Running on minwidraw amount
        it("Chepar withdraw Withdraw ETH from a single founder", async () => {

            //Arrange
            const startingFundmebalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerbalance = await fundMe.provider.getBalance(deployer)

            // Act or Widraw functions
            const actionresponse = await fundMe.cheparWithdraw();
            const transactionRecipt = await actionresponse.wait(1)

            // calculating Gas Cost for transaction
            const { gasUsed, effectiveGasPrice } = transactionRecipt
            const gasCost = gasUsed.mul(effectiveGasPrice.toString())

            //Get Remaining Balance
            const endFundmebalance = await fundMe.provider.getBalance(fundMe.address)
            const endDeployerbalance = await fundMe.provider.getBalance(deployer)

            // Test 
            assert.equal(endFundmebalance, 0)
            assert.equal(startingFundmebalance.add(startingDeployerbalance).toString(), endDeployerbalance.add(gasCost).toString())
        })

        // Case 2----
        it("Chepar withdraw Alloes us to withdraw multiple Funders", async () => {

            // Getting all different accounts from our local chain -----
            const accounts = await ethers.getSigners();
            for (const i of accounts) {

                // Connecting account to our contract for making transaction(calling fund function from it.)
                const fundMeConnectedContract = await fundMe.connect(i)
                await fundMeConnectedContract.fund({ value: sendValue })

                // calculating starting (initial balance for the contracts)
                const startingFundmebalance = await fundMe.provider.getBalance(fundMe.address)
                const startingDeployerbalance = await fundMe.provider.getBalance(deployer)

                // make transaction to send amount to smart contract ----
                const actionresponse = await fundMe.cheparWithdraw();
                const transactionRecipt = await actionresponse.wait(1)

                // calculating Gas Cost for transaction
                const { gasUsed, effectiveGasPrice } = transactionRecipt
                const gasCost = gasUsed.mul(effectiveGasPrice.toString())

                //Calculating balance after making transaction
                const endFundmebalance = await fundMe.provider.getBalance(fundMe.address)
                const endDeployerbalance = await fundMe.provider.getBalance(deployer)

                // validating all balances for contract and the account balancers
                assert.equal(endFundmebalance, 0)
                assert.equal(startingFundmebalance.add(startingDeployerbalance).toString(), endDeployerbalance.add(gasCost).toString())

                // check funders array is reseted to inital position after withdraw all amount from my contract ---

                await expect(fundMe.s_funders(0)).to.be.reverted
                // Checking all mappings are updated correctly -------
                for (const account of accounts) {
                    assert.equal(await fundMe.s_addressToAmountFunder(account.address), 0)
                }
            }
        })

        //Only Owner can Withdraw --
        it("Chepar withdraw Only allows owner To Withdraw", async () => {

            //Getting a dummy attacker account
            const accounts = await ethers.getSigners();
            const attacker = accounts[1]

            // trying to attack
            const attckerConnected = await fundMe.connect(attacker)
            await expect(attckerConnected.cheparWithdraw()).to.be.reverted

        })
    })
})