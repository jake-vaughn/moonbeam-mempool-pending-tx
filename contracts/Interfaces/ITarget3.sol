// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ITarget3 {
    function admin() external view returns (address adminAddress);

    function withdrawEth(uint256 _amount) external;

    function withdrawToken(address _token, uint256 _amount) external;
}
