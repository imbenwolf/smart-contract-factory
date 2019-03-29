pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";

contract SmartContractFactory is Initializable {
    string public test;

    function initialize(string memory _test) public initializer {
        test = _test;
    }
}
