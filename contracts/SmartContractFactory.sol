pragma solidity ^0.4.24;

import "zos-lib/contracts/Initializable.sol";
import "zos-lib/contracts/application/App.sol";

contract SmartContractFactory is Initializable {
    App private app;

    function initialize(App _app) public initializer {
        app = _app;
    }

    function getImplementation(string packageName, string contractName)
        public
        view
        returns (address)
    {
        return app.getImplementation(packageName, contractName);
    }
}
