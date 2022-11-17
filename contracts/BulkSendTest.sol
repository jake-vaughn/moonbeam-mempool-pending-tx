pragma solidity 0.4.24;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {
    /**
     * @dev Multiplies two numbers, reverts on overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    /**
     * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0); // Solidity only automatically asserts when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Adds two numbers, reverts on overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }

    /**
     * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
     * reverts when dividing by zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
}

contract Token {
    uint8 public decimals;

    function transfer(address _to, uint256 _value) public returns (bool success) {}

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {}

    function allowance(address _owner, address _spender) public constant returns (uint256 remaining) {}
}

contract BulkSendTest {
    using SafeMath for uint256;

    address public owner;
    uint256 public tokenSendFee; // in wei
    uint256 public ethSendFee; // in wei

    constructor(uint256 _tokenSendFee, uint256 _ethSendFee) public payable {
        tokenSendFee = _tokenSendFee;
        ethSendFee = _ethSendFee;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function bulkSendEth(address[] addresses, uint256[] amounts) public payable returns (bool success) {
        uint256 total = 0;
        for (uint8 i = 0; i < amounts.length; i++) {
            total = total.add(amounts[i]);
        }

        //ensure that the ethreum is enough to complete the transaction
        uint256 requiredAmount = total.add(ethSendFee * 1 wei); //.add(total.div(100));
        require(msg.value >= (requiredAmount * 1 wei));

        //transfer to each address
        for (uint8 j = 0; j < addresses.length; j++) {
            addresses[j].transfer(amounts[j] * 1 wei);
        }

        //return change to the sender
        if (msg.value * 1 wei > requiredAmount * 1 wei) {
            uint256 change = msg.value.sub(requiredAmount);
            msg.sender.transfer(change * 1 wei);
        }
        return true;
    }

    function getbalance(address addr) public constant returns (uint256 value) {
        return addr.balance;
    }

    function deposit() public payable returns (bool) {
        return true;
    }

    function withdrawEther(address addr, uint256 amount) public onlyOwner returns (bool success) {
        addr.transfer(amount * 1 wei);
        return true;
    }

    function withdrawToken(Token tokenAddr, address _to, uint256 _amount) public onlyOwner returns (bool success) {
        tokenAddr.transfer(_to, _amount);
        return true;
    }

    function bulkSendToken(
        Token tokenAddr,
        address[] addresses,
        uint256[] amounts
    ) public payable returns (bool success) {
        uint256 total = 0;
        address multisendContractAddress = this;
        for (uint8 i = 0; i < amounts.length; i++) {
            total = total.add(amounts[i]);
        }

        require(msg.value * 1 wei >= tokenSendFee * 1 wei);

        // check if user has enough balance
        require(total <= tokenAddr.allowance(msg.sender, multisendContractAddress));

        // transfer token to addresses
        for (uint8 j = 0; j < addresses.length; j++) {
            tokenAddr.transferFrom(msg.sender, addresses[j], amounts[j]);
        }
        // transfer change back to the sender
        if (msg.value * 1 wei > (tokenSendFee * 1 wei)) {
            uint256 change = (msg.value).sub(tokenSendFee);
            msg.sender.transfer(change * 1 wei);
        }
        return true;
    }

    function setTokenFee(uint256 _tokenSendFee) public onlyOwner returns (bool success) {
        tokenSendFee = _tokenSendFee;
        return true;
    }

    function setEthFee(uint256 _ethSendFee) public onlyOwner returns (bool success) {
        ethSendFee = _ethSendFee;
        return true;
    }

    function destroy(address _to) public onlyOwner {
        selfdestruct(_to);
    }
}
