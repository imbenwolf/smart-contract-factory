<template>
  <div>
    <a-alert :message="tokenStandard" type="info" showIcon>
      <p slot="description">
        {{ tokenStandard }} is the Ethereum standard for non-fungible tokens.
        Non-Fungibility means each token is unique and unreplaceable by another
        token.<br />ERC721 is known for it's use as a collectible (e.g
        Cryptokitties).
      </p>
    </a-alert>

    <div class="content">
      <create-token-form
        ref="createTokenForm"
        :tokenStandard="tokenStandard"
        @create-token="createERC721SmartContract"
      />
    </div>
  </div>
</template>

<script>
import CreateTokenForm from "@/components/CreateTokenForm.vue";
import { mapActions } from "vuex";

export default {
  name: "ERC721",
  data() {
    return {
      tokenStandard: "ERC721"
    };
  },
  components: {
    CreateTokenForm
  },
  methods: {
    ...mapActions(["createSmartContract"]),
    async createERC721SmartContract(data) {
      let message = this.$message.loading(
        "Creating ERC721 contract, please confirm transaction on Metamask",
        0
      );
      try {
        const contractName = "StandaloneERC721";
        const txHash = await this.createSmartContract({ contractName, data });
        setTimeout(message, 0);
        this.$notification.success({
          message: "ERC721 created!",
          description: `Your ERC721 token has been created, the transaction hash is: ${txHash}`,
          duration: 0,
          style: {
            width: "600px",
            marginLeft: "-220px",
            marginTop: "25px"
          }
        });
        this.$refs.createTokenForm.form.resetFields();
        this.$router.push({ name: "proxys" });
      } catch (error) {
        setTimeout(message, 0);
        let defaultMessage = "ERC721 could not be created";
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
