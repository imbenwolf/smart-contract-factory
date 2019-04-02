import Contract from "truffle-contract";

import AdminUpgradeabilityProxy from "@/../contracts/AdminUpgradeabilityProxy.sol";

const Proxy = {
  async getInstance(address) {
    const proxy = Contract(AdminUpgradeabilityProxy);
    proxy.setProvider(window.ethereum);
    const proxyInstance = await proxy.at(address);
    return proxyInstance;
  },
  async getImplementationAddress(proxyAddress) {
    const proxy = await Proxy.getInstance(proxyAddress);
    const implemenationAddress = await proxy.implementation({
      from: window.ethereum.selectedAddress
    });
    return implemenationAddress;
  },
  async upgradeImplementation(proxyAddress, implementationAddress) {
    const proxy = await Proxy.getInstance(proxyAddress);
    const result = await proxy.upgradeTo(implementationAddress, {
      from: window.ethereum.selectedAddress
    });
    return result;
  }
};

export default Proxy;
