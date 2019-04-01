import Contract from "truffle-contract";
import SmartContractFactory from "@/../contracts/SmartContractFactory.sol";

const Factory = {
  async getInstance() {
    const smartContractFactory = Contract(SmartContractFactory);
    smartContractFactory.setProvider(window.ethereum);
    const smartContractFactoryInstance = await smartContractFactory.deployed();
    return smartContractFactoryInstance;
  },
  hasNetwork: networkId => Contract(SmartContractFactory).hasNetwork(networkId),
  async getImplementationAddressOfContract(contractName, from) {
    const factory = await Factory.getInstance();
    const implementationAddress = await factory.getImplementation(
      contractName,
      {
        from
      }
    );
    return implementationAddress;
  }
};

export default Factory;
