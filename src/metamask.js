const Metamask = {
  isInstalled: () =>
    typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask,
  requestAccess: async store => {
    try {
      let accounts = await window.ethereum.enable();
      store.commit("setEthereumAccountAddress", accounts[0]);
      Metamask.listenForAccountChange(store);
      store.commit("setIsAskingForMetamaskAccess", false);
    } catch {
      store.commit("setIsAskingForMetamaskAccess", false);
    }
  },
  listenForAccountChange: store => {
    window.ethereum.on("accountsChanged", accounts =>
      store.commit("setEthereumAccountAddress", accounts[0])
    );
  },
  listenForNetworkChange: store => {
    window.ethereum.autoRefreshOnNetworkChange = false;
    window.ethereum.on("networkChanged", networkId => {
      store.commit("setEthereumNetworkId", networkId);
    });
  },
  create: async store => {
    if (Metamask.isInstalled()) {
      store.commit("setIsMetamaskInstalled", true);
      store.subscribe(async ({ type, payload }) => {
        if (type === "setIsAskingForMetamaskAccess" && payload)
          Metamask.requestAccess(store);
      });
      store.commit("setIsAskingForMetamaskAccess", true);
      Metamask.listenForNetworkChange(store);
    }
  }
};

export default Metamask;
