<template>
  <div>
    <a-alert message="Implementation Information" type="info" showIcon>
      <p slot="description">
        Note that your implementation address must be the same as the supported
        implementation address to ensure your users can use your contract over
        this platform reliably
      </p>
    </a-alert>

    <div class="content">
      <div class="overview">
        <a-skeleton v-if="loading" active :paragraph="{ rows: 10 }" />
        <a-tabs v-else-if="proxys.length > 0">
          <a-tab-pane key="1">
            <span slot="tab">
              <a-icon type="fork" />
              Proxys
            </span>

            <a-collapse :bordered="false">
              <a-collapse-panel v-for="proxy in proxys" :key="proxy.address">
                <template slot="header">
                  <a-row>
                    <a-col :span="12">{{ proxy.address }}</a-col>
                    <a-col :span="11" :style="{ 'text-align': 'right' }">{{
                      proxy.name
                    }}</a-col>
                  </a-row>
                </template>
                <div>
                  <p :style="{ margin: 0 }">Proxy contract for:</p>
                  <h2 :style="{ 'margin-bottom': '25px' }">
                    {{ proxy.name }}
                  </h2>
                  <a-divider />
                  <a-row>
                    <a-col :span="12">Your implementation address:</a-col>
                    <a-col :span="12">{{ proxy.implementation }}</a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="12">Supported implementation address:</a-col>
                    <a-col :span="12">
                      {{ getSupportedImplementationAddressByName(proxy.name) }}
                    </a-col>
                  </a-row>

                  <a-row :style="{ textAlign: 'center', marginTop: '16px' }">
                    <a-icon
                      v-if="
                        getSupportedImplementationAddressByName(proxy.name) ===
                          proxy.address
                      "
                      type="check-circle"
                      theme="twoTone"
                      twoToneColor="#52c41a"
                    />
                    <a-icon
                      v-else
                      type="close-circle"
                      theme="twoTone"
                      twoToneColor="#eb2f96"
                    />
                    Implementation addresses
                    {{
                      getSupportedImplementationAddressByName(proxy.name) !==
                      proxy.address
                        ? "don't"
                        : ""
                    }}
                    match
                  </a-row>
                  <a-divider>Upgrade Implementation</a-divider>
                  <a-form
                    layout="inline"
                    style="text-align: center"
                    :form="proxyForms[proxy.address]"
                    @submit.prevent="handleUpgradeImplementation(proxy)"
                  >
                    <a-form-item label="Implementation address">
                      <a-input
                        v-decorator="[
                          'implementationAddress',
                          {
                            rules: [
                              {
                                required: true,
                                whitespace: true,
                                message:
                                  'Please input an implementation address'
                              },
                              {
                                validator: validateEthereumAddressOrEmpty
                              }
                            ]
                          }
                        ]"
                      >
                      </a-input>
                    </a-form-item>
                    <a-form-item>
                      <a-button type="primary" html-type="submit">
                        Upgrade
                      </a-button>
                    </a-form-item>
                  </a-form>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </a-tab-pane>
          <a-tab-pane key="2">
            <span slot="tab">
              <a-icon type="file-protect" />
              Source code
            </span>
            <pre class="code">{{ proxyContract.sourceCode }}</pre>
          </a-tab-pane>
          <a-tab-pane key="3">
            <span slot="tab">
              <a-icon type="code" />
              ABI
            </span>
            <pre class="code">{{ proxyContract.abi }}</pre>
          </a-tab-pane>
        </a-tabs>
        <a-alert
          v-else
          message='You don&#39;t have any proxys. Create one now under "Create".'
          type="info"
          showIcon
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Proxys",
  data() {
    return {
      loading: true,
      proxyForms: [],
      proxyContract: {
        sourceCode: "code",
        abi: "abi"
      },
      supportedContracts: [
        {
          name: "ERC20",
          implementationAddress: "0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975043"
        },
        {
          name: "ERC721",
          implementationAddress: "0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975043"
        }
      ],
      proxys: [
        {
          name: "ERC20",
          address: "0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975041",
          implementation: "0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975121"
        },
        {
          name: "ERC20",
          address: "0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975042",
          implementation: "0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975122"
        },
        {
          name: "ERC721",
          address: "0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975043",
          implementation: "0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975043"
        }
      ]
    };
  },
  methods: {
    getSupportedImplementationAddressByName(name) {
      return this.supportedContracts.find(contract => contract.name === name)
        .implementationAddress;
    },
    validateEthereumAddressOrEmpty(rule, value, callback) {
      if (
        !value ||
        value.replace(/\s/g, "").length === 0 ||
        value === "0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975043"
      ) {
        callback();
      } else {
        callback("Please input a valid ethereum address");
      }
    },
    handleUpgradeImplementation(proxy) {
      this.proxyForms[proxy.address].validateFields(async (err, values) => {
        if (!err) {
          console.log(values);

          let message = this.$message.loading(
            "Upgrading implementation address, please confirm transaction on Metamask",
            0
          );

          setTimeout(() => {
            setTimeout(message, 0);
            this.$notification.success({
              message: "Implementation address upgraded!",
              description:
                "Your Implementation address has been upgraded, the transaction hash is: XY",
              duration: 0,
              style: {
                width: "600px",
                marginLeft: "-220px",
                marginTop: "25px"
              }
            });
          }, 1000);
        }
      });
    }
  },
  async created() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);

    for (let proxy of this.proxys) {
      this.proxyForms[proxy.address] = this.$form.createForm(this);
    }
  }
};
</script>

<style scoped>
.content {
  margin: 16px auto;
}
</style>
