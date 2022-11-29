const { run } = require("hardhat")
const verify = async (address, args) => {
    console.log('Ready To Verify Contract--------')
    try {
        await run("verify:verify", {
            address,
            constructorArguments: args
        })
    }
    catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log('Contract is already verified on this chain');
        }
        else {
            console.error('Some Error Occured when verifying code ---', error)
        }
    }
}

module.exports = {
    verify
}