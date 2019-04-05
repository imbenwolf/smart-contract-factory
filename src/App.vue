<template>
  <a-layout id="app" style="min-height: 100vh">
    <metamask v-if="!isMetamaskInstalled || isNetworkSupported" />
    <a-modal
      :closable="false"
      :footer="null"
      :visible="isMetamaskInstalled && !isNetworkSupported"
      :centered="true"
      class="ant-modal-confirm-error"
    >
      <div class="ant-modal-confirm-body">
        <a-icon type="close-circle" />
        <span class="ant-modal-confirm-title">Network not supported</span>
        <div class="ant-modal-confirm-content">
          This ethereum network is currently not supported.
        </div>
      </div>
    </a-modal>

    <a-layout-sider
      collapsible
      v-model="collapsed"
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }"
    >
      <div
        class="logo"
        :style="{
          'padding-left': collapsed ? '17px' : '23px'
        }"
      >
        <a href="https://blockchain.swisscom.com/" target="_blank">
          <span class="swisscom-logo-lifeform"></span>
          <transition name="slide-fade">
            <img
              v-if="!collapsed"
              class="swisscom-blockchain-logo"
              src="./assets/swisscom-blockchain-logo.png"
            />
          </transition>
        </a>
      </div>

      <a-menu
        theme="dark"
        :selectedKeys="selectedKeys"
        :defaultOpenKeys="['create']"
        mode="inline"
      >
        <a-menu-item key="contracts">
          <router-link :to="{ name: 'contracts' }">
            <a-icon type="dashboard" />
            <span>Contracts</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="proxies">
          <router-link :to="{ name: 'proxies' }">
            <a-icon type="fork" />
            <span>Proxies</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu key="create">
          <span slot="title">
            <a-icon type="plus" />
            <span>Create</span>
          </span>
          <a-menu-item key="erc20">
            <router-link :to="{ name: 'erc20' }">ERC20</router-link>
          </a-menu-item>
          <a-menu-item key="erc721">
            <router-link :to="{ name: 'erc721' }">ERC721</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout
      :style="{
        transition: 'all 0.2s',
        marginLeft: collapsed ? '80px' : '200px'
      }"
    >
      <a-layout-header
        style="background: #fff; padding: 0; height: 76px; line-height: 76px;"
      >
        <a-row
          type="flex"
          justify="space-between"
          :style="{ 'margin-right': '10px' }"
        >
          <a-col>
            <img
              :style="{ height: '70px', marginLeft: '16px' }"
              src="./assets/smart-contract-factory-logo.svg"
            />
          </a-col>
          <a-col v-if="ethereumAccountAddress">
            <span :style="{ marginRight: '16px' }">Logged in:</span>
            <a-tag :style="{ cursor: 'default' }" color="#001529">
              <a-icon type="wallet" :style="{ 'margin-right': '5px' }" />
              {{ ethereumAccountAddress }}
            </a-tag>
          </a-col>
        </a-row>
      </a-layout-header>

      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <transition name="component-fade" mode="out-in">
          <keep-alive v-if="isNetworkSupported && ethereumAccountAddress">
            <router-view />
          </keep-alive>
          <div v-else class="content">
            <a-skeleton
              :active="isNetworkSupported"
              :paragraph="{ rows: 10 }"
            />
          </div>
        </transition>
      </a-layout-content>

      <a-layout-footer style="text-align: center">
        Swisscom Blockchain ©{{ year }} Created by Benjamin Wolf
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import Metamask from "@/components/Metamask.vue";

export default {
  name: "App",
  components: { Metamask },
  data() {
    return {
      collapsed: false,
      selectedKeys: [this.$route.name]
    };
  },
  computed: {
    ...mapGetters([
      "isMetamaskInstalled",
      "ethereumAccountAddress",
      "isNetworkSupported",
      "ethereumNetworkId"
    ]),
    year() {
      return new Date().getFullYear();
    }
  },
  watch: {
    $route(to) {
      this.selectedKeys = [to.name];
    },
    ethereumAccountAddress() {
      if (this.isNetworkSupported) {
        this.fetchAllContracts();
      }
    },
    ethereumNetworkId() {
      if (this.isNetworkSupported) {
        this.fetchAllContracts();
      }
    }
  },
  methods: {
    ...mapActions(["fetchAllContracts"])
  },
  async mounted() {
    if (this.isNetworkSupported) {
      await this.fetchAllContracts();
    }
  }
};
</script>

<style scoped lang="scss">
#app {
  .account {
    float: right;
    padding-right: 16px;
  }

  .logo {
    padding: 35px 0 30px 0;
    transition: padding 0.3s;
    position: relative;

    .slide-fade-leave-to {
      transition: 0s all;
    }

    .swisscom-blockchain-logo {
      height: 45px;
      top: 30px;
      right: 40px;
      padding-left: 15px;
      position: absolute;
    }

    // Code snippet from: https://sdx.swisscom.ch/
    .swisscom-logo-lifeform {
      background-size: 3600px 40px;
      background: url(./assets/swisscom-lifeform-spritesheet.png) no-repeat 0 0;
      width: 40px;
      height: 40px;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      min-width: 40px;
      -webkit-animation: repeatingAnimation 30s steps(90) infinite,
        initialAnimation 6s steps(90);
      animation: repeatingAnimation 30s steps(90) infinite,
        initialAnimation 6s steps(90);
      display: inline-block;
      position: relative;
      left: 0;
      top: 0;
    }

    @keyframes initialAnimation {
      100% {
        background-position: -3600px;
      }
    }

    @keyframes repeatingAnimation {
      0% {
        background-position: 0;
      }
      80% {
        background-position: 0;
      }
      100% {
        background-position: -3600px;
      }
    }
  }
  // Code snippet end

  .component-fade-enter-active,
  .component-fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .component-fade-enter,
  .component-fade-leave-to {
    opacity: 0;
  }
}
</style>

<style lang="scss">
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.content {
  background: white;
  padding: 24px;
}

.ant-alert + .content {
  margin: 16px auto;
}

.overview {
  width: 90%;
  margin: 16px auto;

  .code {
    background-color: #002b36;
    color: #839597;
    padding: 16px;
  }
}
</style>
