import Vue from "vue";
import Vuex from "vuex";

import Metamask from "@/store/metamask.js";
import contractFactory from "@/api/contractFactory.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isMetamaskInstalled: false,
    isAskingForMetamaskAccess: false,
    ethereumAccountAddress: null,
    ethereumNetworkId: null,
    proxys: [],
    contracts: []
  },
  getters: {
    isMetamaskInstalled: state => state.isMetamaskInstalled,
    isAskingForMetamaskAccess: state => state.isAskingForMetamaskAccess,
    ethereumAccountAddress: state => state.ethereumAccountAddress,
    isNetworkSupported: state =>
      contractFactory.hasNetwork(state.ethereumNetworkId)
  },
  mutations: {
    setIsMetamaskInstalled: (state, isInstalled) =>
      (state.isMetamaskInstalled = isInstalled),
    setIsAskingForMetamaskAccess: (state, isAsking) =>
      (state.isAskingForMetamaskAccess = isAsking),
    setEthereumAccountAddress: (state, address) =>
      (state.ethereumAccountAddress = address),
    setEthereumNetworkId: (state, id) => (state.ethereumNetworkId = id),
    setProxys: (state, newProxys) => (state.proxys = newProxys),
    setContracts: (state, newContracts) => (state.contracts = newContracts)
  },
  actions: {
    requestMetamaskAccess: ({ commit }) =>
      commit("setIsAskingForMetamaskAccess", true),
    createSmartContract: async (context, { contractName, data }) =>
      await contractFactory.createSmartContract(contractName, data),
    fetchAllContracts: async ({ commit }) => {
      const contracts = await contractFactory.getAllContracts();
      commit(
        "setProxys",
        contracts
          .filter(contract => contract.isAdmin)
          .map(contract => ({
            address: contract.address,
            name: contract.name
          }))
      );
      commit(
        "setContracts",
        contracts
          .filter(contract => !contract.isAdmin)
          .map(contract => ({
            address: contract.address,
            name: contract.name
          }))
      );
    },
    fetchAllSupportedContracts: async () =>
      await contractFactory.getImplementationAddressOfContract(
        "StandaloneERC721"
      )
  },
  plugins: [Metamask.create]
});
