import Vue from "vue";
import Vuex from "vuex";

import Metamask from "@/store/metamask.js";
import contractFactory from "@/api/factoryContract.js";
import contractProxy from "@/api/proxyContract.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isMetamaskInstalled: false,
    isAskingForMetamaskAccess: false,
    ethereumAccountAddress: null,
    ethereumNetworkId: null,
    loadingAllContracts: false,
    allContracts: [],
    loadingProxys: false,
    proxys: [],
    supportedImplementations: []
  },
  getters: {
    isMetamaskInstalled: state => state.isMetamaskInstalled,
    isAskingForMetamaskAccess: state => state.isAskingForMetamaskAccess,
    ethereumAccountAddress: state => state.ethereumAccountAddress,
    isNetworkSupported: state =>
      contractFactory.hasNetwork(state.ethereumNetworkId),
    loadingAllContracts: state => state.loadingAllContracts,
    loadingProxys: state => state.loadingProxys,
    proxys: state => state.proxys,
    supportedImplementations: state => state.supportedImplementations
  },
  mutations: {
    setIsMetamaskInstalled: (state, isInstalled) =>
      (state.isMetamaskInstalled = isInstalled),
    setIsAskingForMetamaskAccess: (state, isAsking) =>
      (state.isAskingForMetamaskAccess = isAsking),
    setEthereumAccountAddress: (state, address) =>
      (state.ethereumAccountAddress = address),
    setEthereumNetworkId: (state, id) => (state.ethereumNetworkId = id),
    setLoadingAllContracts: (state, isLoading) =>
      (state.loadingAllContracts = isLoading),
    setAllContracts: (state, newContracts) =>
      (state.allContracts = newContracts),
    setLoadingProxys: (state, isLoading) => (state.loadingProxys = isLoading),
    setProxys: (state, newProxys) => (state.proxys = newProxys),
    setSupportedImplementions: (state, newSupportedImplementations) =>
      (state.supportedImplementations = newSupportedImplementations)
  },
  actions: {
    requestMetamaskAccess: ({ commit }) =>
      commit("setIsAskingForMetamaskAccess", true),
    createSmartContract: async ({ dispatch }, { contractName, data }) => {
      const result = await contractFactory.createSmartContract(
        contractName,
        data
      );
      dispatch("fetchAllContracts");
      return result;
    },
    fetchAllContracts: async ({ commit }) => {
      commit("setLoadingAllContracts", true);
      const contracts = await contractFactory.getAllContracts();
      commit("setAllContracts", contracts);
      commit("setLoadingAllContracts", false);
    },
    fetchProxys: async ({ state, commit }) => {
      commit("setLoadingProxys", true);
      let proxys = state.allContracts
        .filter(contract => contract.isAdmin)
        .map(contract => ({
          address: contract.address,
          name: contract.name
        }));
      for (let proxy of proxys) {
        const implementationAddress = await contractProxy.getImplementationAddress(
          proxy.address
        );
        proxy.implementation = implementationAddress;
      }
      commit("setProxys", proxys);
      commit("setLoadingProxys", false);
    },
    upgradeProxyImplementation: async (
      { state, commit },
      { proxyAddress, implementationAddress }
    ) => {
      const result = await contractProxy.upgradeImplementation(
        proxyAddress,
        implementationAddress
      );

      let proxys = state.proxys;
      let upgradedProxy = proxys.find(proxy => (proxy.address = proxyAddress));
      upgradedProxy.implementation = implementationAddress;
      commit("setProxys", proxys);

      return result;
    },
    fetchAllSupportedContracts: async ({ commit }) => {
      const supportedImplementations = await contractFactory.getAllSupportedImplementations();
      commit("setSupportedImplementions", supportedImplementations);
    }
  },
  plugins: [Metamask.create]
});
