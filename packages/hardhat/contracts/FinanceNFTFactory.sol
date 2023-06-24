// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

interface IFinanceNFT {
    function initialize(string calldata _name, string calldata _symbol, address _owner, string memory uri) external;
}


contract FinanceNFTFactory is Initializable {
    address public nftImplementation;

    constructor() {
        //_disableInitializers();
    }

    function initialize(address _nftImplementation) initializer public {
        nftImplementation = _nftImplementation;
    }

    event FinanceNFTCreated(
        address indexed owner,
        address nftContract
    );

    // @dev deploys a FinanceNFT contract
    function createFinanceNFT(string calldata _name, string calldata _symbol, address owner, string memory uri) external returns (address) {
        bytes32 salt = keccak256(abi.encode(_name, _symbol, owner));
        address clone = Clones.cloneDeterministic(nftImplementation, salt);
        IFinanceNFT(clone).initialize(_name, _symbol, owner, uri);
        emit FinanceNFTCreated(msg.sender, clone);
        return clone;
    }


}
