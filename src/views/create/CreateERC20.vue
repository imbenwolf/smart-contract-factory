<template>
  <div>
    <a-alert :message="tokenStandard" type="info" showIcon>
      <p slot="description">
        {{ tokenStandard }} is the Ethereum standard for fungible tokens.
        Fungibility means each token is replaceable by an identical token.<br />ERC20
        is the most used token contract and known for it's use in ICOs.
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
    async createERC20SmartContract(data) {
      console.log(data);

      let message = this.$message.loading(
        "Creating ERC20 contract, please confirm transaction on Metamask",
        0
      );
      setTimeout(() => {
        setTimeout(message, 0);
        this.$notification.success({
          message: "ERC20 created!",
          description:
            "Your ERC20 token has been created, the transaction hash is: XY",
          duration: 0,
          style: {
            width: "600px",
            marginLeft: "-220px",
            marginTop: "25px"
          }
        });
        this.$refs.createTokenForm.form.resetFields();
      }, 1000);
    }
  }
};
</script>
