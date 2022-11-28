const { task } = require('hardhat/config')

task('information', "Prints current chain information-----").setAction(
    async (taskArgs, hre) => {
        const blockNumber = await hre.ethers.provider.getBlockNumber();
        // const contractbalance = await hre.ethers.provider.getBalance()
        const feesData = await hre.ethers.provider.getFeeData()
        const taskdata = {
            blockNumber,
            gasPrice: feesData.gasPrice.toString(),
            lastBaseFeePerGas: feesData.lastBaseFeePerGas.toString(),
            maxPriorityFeePerGas: feesData.maxPriorityFeePerGas.toString(),
            maxPriorityFeePerGas: feesData.maxPriorityFeePerGas.toString()



        }
        console.log('*************** I Found these Results by blockchain *******************')
        console.table(taskdata)

    }
)