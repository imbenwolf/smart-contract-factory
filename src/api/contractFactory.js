import Web3 from "web3";
import Contract from "truffle-contract";
import encodeCall from "zos-lib/lib/helpers/encodeCall";

import SmartContractFactory from "@/../contracts/SmartContractFactory.sol";

const Factory = {
  async getInstance() {
    const smartContractFactory = Contract(SmartContractFactory);
    smartContractFactory.setProvider(window.ethereum);
    const smartContractFactoryInstance = await smartContractFactory.deployed();
    return smartContractFactoryInstance;
  },
  hasNetwork: networkId => Contract(SmartContractFactory).hasNetwork(networkId),
  createSmartContract: async (contractName, data) => {
    switch (contractName) {
      case "StandaloneERC20":
        return await Factory.createERC20Token(data);
      case "StandaloneERC721":
        return await Factory.createERC721Token(data);
    }
  },
  async createERC20Token(data) {
    const web3 = new Web3(window.ethereum);
    let types = ["string", "string", "uint8", "address[]", "address[]"];
    let values = [
      data.name,
      data.symbol,
      data.decimals,
      data.minters,
      data.pausers
    ];
    if (data.initialNumberOfTokens && data.initialHolderOfTokens) {
      const initialTokens = web3.utils.numberToHex(
        data.initialNumberOfTokens * 10 ** data.decimals
      );
      types.splice(3, 0, "uint256");
      values.splice(3, 0, initialTokens);

      types.splice(4, 0, "address");
      values.splice(4, 0, data.initialHolderOfTokens);
    }

    const encodedData = encodeCall("initialize", types, values);
    const factory = await Factory.getInstance();

    const { tx } = await factory.createSmartContract(
      "StandaloneERC20",
      encodedData,
      {
        from: window.ethereum.selectedAddress
      }
    );
    return tx;
  },
  async createERC721Token(data) {
    const types = ["string", "string", "address[]", "address[]"];
    const values = [data.name, data.symbol, data.minters, data.pausers];

    const encodedData = encodeCall("initialize", types, values);
    const factory = await Factory.getInstance();

    const { tx } = await factory.createSmartContract(
      "StandaloneERC721",
      encodedData,
      {
        from: window.ethereum.selectedAddress
      }
    );
    return tx;
  },
  async getImplementationAddressOfContract(contractName) {
    const factory = await Factory.getInstance();
    const implementationAddress = await factory.getImplementation(
      contractName,
      {
        from: window.ethereum.selectedAddress
      }
    );
    return implementationAddress;
  }
};

export default Factory;
