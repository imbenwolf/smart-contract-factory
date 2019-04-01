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
    ethereumNetworkId: null
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
    setEthereumNetworkId: (state, id) => (state.ethereumNetworkId = id)
  },
  actions: {
    requestMetamaskAccess: ({ commit }) =>
      commit("setIsAskingForMetamaskAccess", true),
    fetchAllSupportedContracts: async ({ state }) => {
      console.log(
        await contractFactory.getImplementationAddressOfContract(
          "StandaloneERC721",
          state.ethereumAccountAddress
        )
      );
    }
  },
  plugins: [Metamask.create]
});
