// mocha test cases
const { ethers } = require('hardhat')
const { expect, assert } = require('chai')
describe("SimpleStorage",
  async () => {
    // before each runs before every it function or test case-----
    let simpleStorageFactory, simpleStorage
    beforeEach(
      async () => {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
      }
    )
    //test 1 
    it("Should start with a fav number 0", async () => {
      const currentvalue = await simpleStorage.retrive()
      const expectedValue = "0"
      assert.equal(currentvalue.toString(), expectedValue)
    })
    // test 2
    it("Should Update when we call Store ", async () => {
      const expectedValue = "7"
      const transactionResponse = await simpleStorage.store("7")
      const currentvalue = await simpleStorage.retrive()
      await transactionResponse.wait(1)
      assert.equal(currentvalue.toString(), expectedValue)
    })

  }
)
