import Vue from "vue";
import Router from "vue-router";

import Contracts from "@/views/Contracts.vue";
import Proxys from "@/views/Proxys.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "contracts",
      component: Contracts
    },
    {
      path: "/proxys",
      name: "proxys",
      component: Proxys
    },
    {
      path: "/create",
      component: null,
      children: [
        {
          path: "erc20",
          name: "erc20",
          component: null
        },
        {
          path: "erc721",
          name: "erc721",
          component: null
        }
      ]
    }
  ]
});
