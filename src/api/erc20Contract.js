import Contract from "truffle-contract";

import StandaloneERC20 from "@/../contracts/flattened-resources/StandaloneERC20.sol";

const ERC20 = {
  async getInstance(address) {
    const erc20 = Contract(StandaloneERC20);
    erc20.setProvider(window.ethereum);
    const erc20Instance = await erc20.at(address);
    return erc20Instance;
  },
  async getInformation(erc20Address) {
    const erc20 = await ERC20.getInstance(erc20Address);
    const from = window.ethereum.selectedAddress;
    const name = await erc20.name({ from });
    const symbol = await erc20.symbol({ from });
    const decimals = await erc20.decimals({ from });
    const totalSupply = await erc20.totalSupply({ from });
    return {
      name,
      symbol,
      decimals,
      totalSupply
    };
  },
  async getBalance(erc20Address, balanceAddress) {
    const erc20 = await ERC20.getInstance(erc20Address);
    const balance = await erc20.balanceOf(balanceAddress, {
      from: window.ethereum.selectedAddress
    });
    return balance;
  }
};

export default ERC20;
