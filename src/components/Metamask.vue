<template>
  <a-drawer
    placement="right"
    wrapClassName="metamask"
    :width="600"
    :closable="false"
    :visible="!isMetamaskInstalled || !ethereumAccountAddress"
  >
    <a-row :style="{ 'margin-bottom': '50px' }" type="flex" justify="center">
      <a-col :span="10">
        <img src="../assets/metamask-logo.svg" />
      </a-col>
    </a-row>
    <div v-if="!isMetamaskInstalled">
      <a-row :style="{ 'margin-bottom': '20px' }" type="flex" justify="center">
        Please install the Metamask plugin in order to use this application.
      </a-row>
      <a-row :style="{ 'margin-bottom': '20px' }" type="flex" justify="center">
        <a href="https://metamask.io/" target="_blank">
          <img
            :style="{ width: '200px' }"
            src="../assets/metamask-download.png"
          />
        </a>
      </a-row>
      <a-row :style="{ 'margin-bottom': '20px' }" type="flex" justify="center">
        <a-button type="primary" onclick="location.reload()">
          Done!
        </a-button>
      </a-row>
      <a-row :style="{ 'margin-bottom': '20px' }" type="flex" justify="center">
        How it works:
      </a-row>
      <a-row type="flex" justify="center">
        <iframe
          width="384"
          height="216"
          src="https://www.youtube.com/embed/ZIGUC9JAAw8?rel=0&modestbranding=1"
          allowfullscreen
          frameborder="0"
        ></iframe>
      </a-row>
    </div>
    <div v-else-if="!ethereumAccountAddress">
      <a-row :style="{ 'margin-bottom': '20px' }" type="flex" justify="center">
        Please enable access to the Metamask plugin in order to use this
        application.
      </a-row>
      <a-row type="flex" justify="center">
        <a-button
          type="primary"
          :loading="isAskingForMetamaskAccess"
          @click="requestMetamaskAccess"
        >
          {{ isAskingForMetamaskAccess ? "Loading" : "Enable access" }}
        </a-button>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Metamask",
  computed: {
    ...mapGetters([
      "isMetamaskInstalled",
      "isAskingForMetamaskAccess",
      "ethereumAccountAddress"
    ])
  },
  methods: {
    ...mapActions(["requestMetamaskAccess"])
  }
};
</script>

<style lang="scss">
.metamask {
  .ant-drawer-body {
    height: 100vh;
    background-color: #dce2e5;
    background-image: url(../assets/metamask-background.jpg);
    background-repeat: no-repeat;
    background-size: contain;
    font-size: 16px;
  }
}
</style>
