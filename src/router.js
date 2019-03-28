import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "contracts",
      component: null
    },
    {
      path: "/proxies",
      name: "proxies",
      component: null
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
