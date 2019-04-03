import Vue from "vue";
import Router from "vue-router";

import Contracts from "@/views/Contracts.vue";
import Proxies from "@/views/Proxies.vue";

import CreateERC20 from "@/views/create/CreateERC20.vue";
import CreateERC721 from "@/views/create/CreateERC721.vue";

Vue.use(Router);

const withPrefix = (prefix, routes) =>
  routes.map(route => {
    route.path = prefix + route.path;
    return route;
  });

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
      path: "/proxies",
      name: "proxies",
      component: Proxies
    },
    ...withPrefix("/create", [
      {
        path: "/erc20",
        name: "erc20",
        component: CreateERC20
      },
      {
        path: "/erc721",
        name: "erc721",
        component: CreateERC721
      }
    ]),
    {
      path: "*",
      redirect: { name: "contracts" }
    }
  ]
});
