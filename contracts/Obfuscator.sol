// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/*-------------------- Imports -----------------------*/
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";

contract Obfuscator is Ownable {
    /*-------------------- State Varibles ------------------------*/
    mapping(address => bool) callers;

    modifier onlyCaller() {
        _checkCaller();
        _;
    }

    constructor() {}

    function forwardCall(address target, bytes memory data) public onlyCaller {
        target.call(data);
    }

    function withdrawEth() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawToken(address token) public onlyOwner {
        IERC777 _token = IERC777(token);
        uint256 balance = _token.balanceOf(address(this));
        _token.send(owner(), balance, "");
    }

    function setCallers(address[] memory addresses) public onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            callers[addresses[i]] = true;
        }
    }

    function revokeCallers(address[] memory addresses) public onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            callers[addresses[i]] = false;
        }
    }

    function _checkCaller() internal view {
        require(callers[_msgSender()], "caller is not a set caller");
    }
}
