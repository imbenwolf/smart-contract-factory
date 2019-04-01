pragma solidity ^0.4.24;

import "zos-lib/contracts/Initializable.sol";
import "zos-lib/contracts/application/App.sol";

/**
 * @title SmartContractFactory
 * @dev Contract for the Smart Contract Factory platform.
 */
contract SmartContractFactory is Initializable {
    /**
   * @dev Contract object of the ZeppelinOS toolkit for upgradable applications as
   * defined in https://docs.zeppelinos.org/docs/application_App.html.
   * It handles creation of proxies and getting the implementations of supported logic contracts.
   */
    App private app;

    /**
   * @dev String of the default package name to use for this application. 
   * Used when creating proxys or getting the implementation addresses of supported logic contracts.
   */
    string private defaultPackageName;

    /**
   * @dev Maps from address to an array of contract structs of proxy address, 
   * name of underlying logic contract and indicator if the mapped address is the admin of the proxy.
   */
    mapping(address => Contract[]) private userContracts;

    /**
   * @dev Struct to keep track of created and saved proxys, 
   * in order to view and interact with them correctly on the platform.
   */
    struct Contract {
        address contractAddress;
        string contractName;
        bool isContractAdmin;
    }

    /**
   * @dev Function to initialize the smart contract as defined by the ZeppelinOS 
   * Initializable contract in https://docs.zeppelinos.org/docs/Initializable.html.
   * @param _app The address of the App contract when publishing the project as
   * described in https://docs.zeppelinos.org/docs/publishing.html.
   */
    function initialize(App _app) public initializer {
        app = _app;
        defaultPackageName = "openzeppelin-eth";
    }

    /**
   * @dev Function to get the supported implementation address of a logic contract.
   * The supported logic contracts are specified by linking EVM packages through ZeppelinOS
   * see https://docs.zeppelinos.org/docs/linking.html for more information. 
   * Reverts if the contract name is not supported.
   * @param contractName The name of a supported logic contract.
   * @return The address of the supported logic contract.
   */
    function getImplementation(string contractName)
        public
        view
        returns (address)
    {
        require(isContractSupported(contractName), "contract not supported");

        return app.getImplementation(defaultPackageName, contractName);
    }

    /**
   * @dev Function to create a new proxy for the given contract and forwards a function call to it
   * in order to intitalize the proxied contract.
   * Reverts if the sent data is empty or the contract name is not supported.
   * @param contractName The name of a supported logic contract.
   * @param _data The encoded data to initialize the proxy by forwarding the data to the corresponding logic contract.
   * It should include the signature and the parameters of the function to be called, as described in
   * https://solidity.readthedocs.io/en/v0.4.24/abi-spec.html#function-selector-and-argument-encoding.
   */
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

    /**
   * @dev Function to save the smart contract to the account of the sender 
   * by adding it to the userContracts mapping in order to interact with it on the platform
   * Note that a contract should only be added if the sender is not the owner of the proxy.
   * For information why see https://blog.zeppelinos.org/the-transparent-proxy-pattern/
   * Reverts if the contract name is not supported or the contract address is not valid.
   * @param contractAddress The address of the proxy contract.
   * @param contractName The name of a supported logic contract.
   */
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

    /**
   * @dev Function to get the number of contracts saved in the userContracts mapping
   * mapped to the address of the sender.
   * @return The number of contracts saved for the sender.
   */
    function getNumberOfContracts() public view returns (uint) {
        address owner = msg.sender;
        Contract[] storage contracts = userContracts[owner];
        return contracts.length;
    }

    /**
   * @dev Function to get the address of the proxy contract, the name of the underlying logic contract
   * and an idicator if the sender is the admin of the proxy contract.
   * Reverts if the key is not found in the userContracts mapping.
   * @param key The key of the contract saved in the userContract mapping mapped to the address of the sender.
   * @return The address of the proxy contract, the name of the underlying logic contract 
   * and a boolean indicating if the sender is the admin of the proxy of contract.
   */
    function getContract(uint key) public view returns (address, string, bool) {
        address owner = msg.sender;
        Contract[] storage contracts = userContracts[owner];
        Contract storage contractByKey = contracts[key];
        return (contractByKey.contractAddress, contractByKey.contractName, contractByKey.isContractAdmin);
    }

    /**
   * @dev Function to check if a contract name is supported in the application.
   * @param contractName The name of a supported logic contract.
   * @return A boolean indicating if the contract name is supported in the application.
   */
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
