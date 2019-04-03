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
        <a-skeleton
          v-if="loadingAllContracts || loadingProxies"
          active
          :paragraph="{ rows: 10 }"
        />
        <a-tabs v-else-if="proxies.length > 0">
          <a-tab-pane key="1">
            <span slot="tab">
              <a-icon type="fork" />
              Proxies
            </span>

            <a-collapse :bordered="false">
              <a-collapse-panel v-for="proxy in proxies" :key="proxy.address">
                <template slot="header">
                  <a-row>
                    <a-col :span="12">{{ proxy.address }}</a-col>
                    <a-col :span="11" :style="{ 'text-align': 'right' }">{{
                      proxy.name
                    }}</a-col>
                  </a-row>
                </template>

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
                        proxy.implementation
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
                    proxy.implementation
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
                              message: 'Please input an implementation address'
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
              </a-collapse-panel>
            </a-collapse>
          </a-tab-pane>

          <a-tab-pane key="2">
            <span slot="tab">
              <a-icon type="file-protect" />
              Source code
            </span>
            <pre class="code">{{ proxyContract.source }}</pre>
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
          message='You don&#39;t have any proxies. Create one now under "Create".'
          type="info"
          showIcon
        />
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
const web3 = new Web3(window.ethereum);

import AdminUpgradeabilityProxy from "@/../contracts/AdminUpgradeabilityProxy.sol";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Proxies",
  data() {
    return {
      proxyForms: [],
      proxyContract: AdminUpgradeabilityProxy
    };
  },
  computed: {
    ...mapGetters([
      "loadingAllContracts",
      "loadingProxies",
      "proxies",
      "supportedImplementations"
    ])
  },
  watch: {
    async loadingAllContracts(isLoading) {
      if (!isLoading) this.setupComponent();
    }
  },
  methods: {
    ...mapActions(["fetchProxies", "upgradeProxyImplementation"]),
    async setupComponent() {
      await this.fetchProxies();

      let forms = [];
      for (let proxy of this.proxies) {
        forms[proxy.address] = this.$form.createForm(this);
      }
      this.proxyForms = forms;
    },
    getSupportedImplementationAddressByName(name) {
      return this.supportedImplementations.find(
        contract => contract.name === name
      ).implementation;
    },
    validateEthereumAddressOrEmpty(rule, value, callback) {
      if (
        !value ||
        value.replace(/\s/g, "").length === 0 ||
        web3.utils.isAddress(value)
      ) {
        callback();
      } else {
        callback("Please input a valid ethereum address");
      }
    },
    async handleUpgradeImplementation(proxy) {
      this.proxyForms[proxy.address].validateFields(async (err, values) => {
        if (!err) {
          let message = this.$message.loading(
            "Upgrading implementation address, please confirm transaction on Metamask",
            0
          );

          try {
            const { tx } = await this.upgradeProxyImplementation({
              proxyAddress: proxy.address,
              implementationAddress: values.implementationAddress
            });
            setTimeout(message, 0);
            this.$notification.success({
              message: "Implementation address upgraded!",
              description: `Your Implementation address has been upgraded, the transaction hash is: ${tx}`,
              duration: 0,
              style: {
                width: "600px",
                marginLeft: "-220px",
                marginTop: "25px"
              }
            });
            this.proxyForms[proxy.address].resetFields();
          } catch (error) {
            setTimeout(message, 0);
            let defaultMessage = "Implementation address could not be upgraded";
            if (error.message.includes("User denied transaction signature")) {
              this.$message.error(`Transaction rejected. ${defaultMessage}`);
            } else {
              this.$message.error(defaultMessage);
            }
          }
        }
      });
    }
  },
  mounted() {
    if (!this.loadingAllContracts) this.setupComponent();
  }
};
</script>
