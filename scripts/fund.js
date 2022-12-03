const { getUnnamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getUnnamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("-- Now Funding --")
    const transaction = await fundMe.fund({ value: ethers.utils.parseEther("1") })
    await transaction.wait(1)
    console.log("-- Funded Sucessfully --")
}


main().then(
    () => {
        process.exit(0)
    }
).catch((error) => {
    console.error('Something went wrong', error)
    process.exit(1)
})