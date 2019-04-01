pragma solidity ^0.4.24;

import "zos-lib/contracts/Initializable.sol";
import "zos-lib/contracts/application/App.sol";

contract SmartContractFactory is Initializable {
    App private app;
    string private defaultPackageName;

    mapping(address => Contract[]) private userContracts;

    struct Contract {
        address contractAddress;
        string contractName;
        bool isContractAdmin;
    }

    function initialize(App _app) public initializer {
        app = _app;
        defaultPackageName = "openzeppelin-eth";
    }

    function getImplementation(string contractName)
        public
        view
        returns (address)
    {
        require(isContractSupported(contractName), "contract not supported");

        return app.getImplementation(defaultPackageName, contractName);
    }

    function createSmartContract(string contractName, bytes _data) public {
        require(_data.length != 0, "data is required");
        require(isContractSupported(contractName), "contract not supported");

        address contractAddress = app.create(
            defaultPackageName,
            contractName,
            msg.sender,
            _data
        );

        address owner = msg.sender;
        Contract[] storage contracts = userContracts[owner];
        Contract memory newContract = Contract(
            contractAddress,
            contractName,
            true
        );
        contracts.push(newContract);
    }

    function saveSmartContract(address contractAddress, string contractName)
        public
    {
        require(isContractSupported(contractName), "contract not supported");

        address owner = msg.sender;
        Contract[] storage contracts = userContracts[owner];
        Contract memory newContract = Contract(
            contractAddress,
            contractName,
            false
        );
        contracts.push(newContract);
    }

    function getNumberOfContracts() public view returns (uint) {
        address owner = msg.sender;
        Contract[] storage contracts = userContracts[owner];
        return contracts.length;
    }

    function getContract(uint key) public view returns (address, string, bool) {
        address owner = msg.sender;
        Contract[] storage contracts = userContracts[owner];
        Contract storage contractByKey = contracts[key];
        return (contractByKey.contractAddress, contractByKey.contractName, contractByKey.isContractAdmin);
    }

    function isContractSupported(string contractName)
        private
        pure
        returns (bool)
    {
        return keccak256(abi.encodePacked(contractName)) == keccak256(
            abi.encodePacked("StandaloneERC20")
        ) || keccak256(abi.encodePacked(contractName)) == keccak256(
            abi.encodePacked("StandaloneERC721")
        );
    }
}
