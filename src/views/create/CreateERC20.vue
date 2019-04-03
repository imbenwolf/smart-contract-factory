<template>
  <div>
    <a-alert :message="tokenStandard" type="info" showIcon>
      <p slot="description">
        {{ tokenStandard }} is the Ethereum standard for fungible tokens.
        Fungibility means each token is replaceable by an identical token.<br />ERC20
        is the most used token contract and known for it's use in ICOs.
        <a href="https://en.bitcoinwiki.org/wiki/ERC20" target="_blank"
          >More information</a
        >
      </p>
    </a-alert>

    <div class="content">
      <create-token-form
        ref="createTokenForm"
        :tokenStandard="tokenStandard"
        @create-token="createERC20SmartContract"
      />
    </div>
  </div>
</template>

<script>
import CreateTokenForm from "@/components/CreateTokenForm.vue";
import { mapActions } from "vuex";

export default {
  name: "ERC20",
  data() {
    return {
      tokenStandard: "ERC20"
    };
  },
  components: {
    CreateTokenForm
  },
  methods: {
    ...mapActions(["createSmartContract"]),
    async createERC20SmartContract(data) {
      let message = this.$message.loading(
        "Creating ERC20 contract, please confirm transaction on Metamask",
        0
      );
      try {
        const contractName = "StandaloneERC20";
        const txHash = await this.createSmartContract({ contractName, data });
        setTimeout(message, 0);
        this.$notification.success({
          message: "ERC20 created!",
          description: `Your ERC20 token has been created, the transaction hash is: ${txHash}`,
          duration: 0,
          style: {
            width: "600px",
            marginLeft: "-220px",
            marginTop: "25px"
          }
        });
        this.$refs.createTokenForm.form.resetFields();
        this.$router.push({ name: "proxies" });
      } catch (error) {
        setTimeout(message, 0);
        let defaultMessage = "ERC20 could not be created";
        if (error.message.includes("User denied transaction signature")) {
          this.$message.error(`Transaction rejected. ${defaultMessage}`);
        } else {
          this.$message.error(defaultMessage);
        }
      }
    }
  }
};
</script>
