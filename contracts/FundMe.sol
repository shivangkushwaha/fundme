//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "./PriceConverter.sol";
// Error Codes
error FundMe_notOwner();

//Interfaces Lib
// Contract

/** @title A COntract For crowd funding
 * @author Shivang Kushwaha
 * @notice This contract is demon
 * @dev This implements price feeds as our library
 */
contract FundMe {
    // type declartion
    using PriceConverter for uint256;
    // state Variable
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address[] public s_funders;
    mapping(address => uint256) private s_addressToAmountFunder;
    address private immutable i_owner;
    AggregatorV3Interface private s_priceFeed;

    //Modifier
    // Declaring modifire for sending all Data with Only modifire
    modifier onlyowner() {
        // require(msg.sender==i_owner,"You are not authrized to take this action.");
        if (msg.sender != i_owner) {
            revert FundMe_notOwner();
        }
        _;
    }

    // contructor
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /**
     * @notice The Function Fund This Contract
     * @dev Accepts Money
     */
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) > MINIMUM_USD,
            "You are not eligible yet for donate minimum amount of fund...."
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunder[msg.sender] = msg.value;
    }

    function widraw() public onlyowner {
        for (uint256 i = 0; i < s_funders.length; i = i + 1) {
            // Reset all s_funders Array Valu or Array---------------
            s_addressToAmountFunder[s_funders[i]] = 0;
        }
        // Reset array---------------------
        s_funders = new address[](0);
        // transfer Method
        // change msg.sender to payblre type
        payable(msg.sender).transfer(address(this).balance);
        //send
        bool sucess = payable(msg.sender).send(address(this).balance);
        require(sucess, "Transfer Failed......");
        // call function
        (bool callsucess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callsucess, "Transfer Failed......");
    }

    function cheparWithdraw() public payable onlyowner {
        address[] memory m_funders = s_funders;

        for (uint256 i = 0; i < m_funders.length; i = i + 1) {
            // Reset all s_funders Array Valu or Array---------------
            s_addressToAmountFunder[m_funders[i]] = 0;
        }
        s_funders = new address[](0);
        (bool callsucess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callsucess, "Transfer Failed......");
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint index) public view returns (address) {
        return s_funders[index];
    }

    function getAdressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunder[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
