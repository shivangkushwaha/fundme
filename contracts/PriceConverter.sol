//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(
        AggregatorV3Interface priceFee
    ) internal view returns (uint256) {
        // API
        // Address :- 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        //AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e).version();
        // AggregatorV3Interface priceFee = AggregatorV3Interface(
        //     0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        // );
        (, int256 price, , , ) = priceFee.latestRoundData();
        return uint256(price * 1e10); //1**10=1000000000000
    }

    function getConversionRate(
        uint256 ethamount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint ethAmountInUsd = (ethPrice * ethamount) / 1e18;
        return ethAmountInUsd;
    }
}
