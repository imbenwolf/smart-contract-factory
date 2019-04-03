import Vue from "vue";
import Vuex from "vuex";

import Metamask from "@/store/metamask.js";
import factoryContract from "@/api/factoryContract.js";
import proxyContract from "@/api/proxyContract.js";
import erc20Contract from "@/api/erc20Contract.js";
import erc721Contract from "@/api/erc721Contract.js";

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
    supportedImplementations: [],
    loadingSavedContracts: false,
    savedContracts: []
  },
  getters: {
    isMetamaskInstalled: state => state.isMetamaskInstalled,
    isAskingForMetamaskAccess: state => state.isAskingForMetamaskAccess,
    ethereumAccountAddress: state => state.ethereumAccountAddress,
    isNetworkSupported: state =>
      factoryContract.hasNetwork(state.ethereumNetworkId),
    loadingAllContracts: state => state.loadingAllContracts,
    loadingProxys: state => state.loadingProxys,
    proxys: state => state.proxys,
    supportedImplementations: state => state.supportedImplementations,
    loadingSavedContracts: state => state.loadingSavedContracts,
    savedContracts: state => state.savedContracts
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
      (state.supportedImplementations = newSupportedImplementations),
    setLoadingSavedContracts: (state, isLoading) =>
      (state.loadingSavedContracts = isLoading),
    setSavedContracts: (state, newSavedContracts) =>
      (state.savedContracts = newSavedContracts)
  },
  actions: {
    requestMetamaskAccess: ({ commit }) =>
      commit("setIsAskingForMetamaskAccess", true),
    createSmartContract: async ({ dispatch }, { contractName, data }) => {
      const result = await factoryContract.createSmartContract(
        contractName,
        data
      );
      dispatch("fetchAllContracts");
      return result;
    },
    fetchAllContracts: async ({ commit }) => {
      commit("setLoadingAllContracts", true);
      const contracts = await factoryContract.getAllContracts();
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
        const implementationAddress = await proxyContract.getImplementationAddress(
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
      const result = await proxyContract.upgradeImplementation(
        proxyAddress,
        implementationAddress
      );

      let proxys = state.proxys;
      let upgradedProxy = proxys.find(proxy => (proxy.address = proxyAddress));
      upgradedProxy.implementation = implementationAddress;
      commit("setProxys", proxys);

      return result;
    },
    fetchAllSupportedImplementations: async ({ commit }) => {
      const supportedImplementations = await factoryContract.getAllSupportedImplementations();
      commit("setSupportedImplementions", supportedImplementations);
    },
    saveSmartContract: async (
      { dispatch },
      { contractAddress, contractName }
    ) => {
      const result = await factoryContract.saveSmartContract(
        contractAddress,
        contractName
      );
      dispatch("fetchAllContracts");
      return result;
    },
    fetchSavedContracts: async ({ state, commit }) => {
      commit("setLoadingSavedContracts", true);
      let savedContracts = state.allContracts
        .filter(contract => !contract.isAdmin)
        .map(contract => ({
          address: contract.address,
          name: contract.name
        }));
      for (let savedContract of savedContracts) {
        let contractInformation;
        try {
          switch (savedContract.name) {
            case "StandaloneERC20":
              contractInformation = await erc20Contract.getInformation(
                savedContract.address
              );
              break;
            case "StandaloneERC721":
              contractInformation = await erc721Contract.getInformation(
                savedContract.address
              );
              break;
          }
        } catch (error) {
          contractInformation = { error: true };
        }
        savedContract.information = contractInformation;
      }
      commit("setSavedContracts", savedContracts);
      commit("setLoadingSavedContracts", false);
    },
    getBalance: async (context, { contract, balanceAddress }) => {
      let balance;
      switch (contract.name) {
        case "StandaloneERC20":
          balance = await erc20Contract.getBalance(
            contract.address,
            balanceAddress
          );
          break;
        case "StandaloneERC721":
          balance = await erc721Contract.getBalance(
            contract.address,
            balanceAddress
          );
          break;
      }
      return balance;
    }
  },
  plugins: [Metamask.create]
});
