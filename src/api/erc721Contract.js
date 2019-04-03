import Contract from "truffle-contract";

import StandaloneERC721 from "@/../contracts/StandaloneERC721.sol";

const ERC721 = {
  async getInstance(address) {
    const erc721 = Contract(StandaloneERC721);
    erc721.setProvider(window.ethereum);
    const erc721Instance = await erc721.at(address);
    return erc721Instance;
  },
  async getInformation(erc721Address) {
    const erc721 = await ERC721.getInstance(erc721Address);
    const from = window.ethereum.selectedAddress;
    const name = await erc721.name({ from });
    const symbol = await erc721.symbol({ from });
    const totalSupply = await erc721.totalSupply({ from });
    return {
      name,
      symbol,
      totalSupply
    };
  },
  async getBalance(erc721Address, balanceAddress) {
    const erc721 = await ERC721.getInstance(erc721Address);
    const balance = await erc721.balanceOf(balanceAddress, {
      from: window.ethereum.selectedAddress
    });
    return balance;
  }
};

export default ERC721;
