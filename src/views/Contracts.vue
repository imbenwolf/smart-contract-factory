<template>
  <div class="content">
    <a-divider>Save public contract</a-divider>
    <a-form
      layout="inline"
      :style="{ textAlign: 'center', marginBottom: '42px' }"
      :form="savePublicContractForm"
      @submit.prevent="handleSavePublicContract"
    >
      <a-form-item label="Address">
        <a-input
          placeholder="e.g. 0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975043"
          v-decorator="[
            'address',
            {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input an address'
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
      <a-form-item label="Supported contract">
        <a-select
          placeholder="Select a contract"
          style="width: 200px"
          v-decorator="[
            'supportedContract',
            {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please select a supported contract'
                }
              ]
            }
          ]"
        >
          <a-select-option
            v-for="supportedImplementation in supportedImplementations"
            :key="supportedImplementation.name"
            >{{ supportedImplementation.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">
          Save
        </a-button>
      </a-form-item>
    </a-form>
    <a-divider />

    <div class="overview">
      <a-skeleton
        v-if="loadingAllContracts || loadingSavedContracts"
        active
        :paragraph="{ rows: 10 }"
      />
      <a-collapse v-else-if="savedContracts.length > 0" :bordered="false">
        <a-collapse-panel
          v-for="(savedContract, index) in savedContracts"
          :key="index"
        >
          <template slot="header">
            <a-row>
              <a-col :span="11">{{ savedContract.address }}</a-col>
              <a-col :span="8">
                <span v-if="savedContract.information.error">
                  <a-icon
                    type="close-circle"
                    theme="twoTone"
                    twoToneColor="#eb2f96"
                  />
                  Click here for next steps
                </span>
                <span v-else>
                  <a-icon
                    type="check-circle"
                    theme="twoTone"
                    twoToneColor="#52c41a"
                  />
                  {{ savedContract.information.name }}
                </span>
              </a-col>
              <a-col :span="5" :style="{ 'text-align': 'right' }">{{
                savedContract.name
              }}</a-col>
            </a-row>
          </template>

          <p :style="{ margin: 0 }">Logic contract for:</p>
          <h2 :style="{ 'margin-bottom': '25px' }">{{ savedContract.name }}</h2>

          <a-alert v-if="savedContract.information.error" type="error" showIcon>
            <span slot="message">
              Couldn't interact with the contract. Make sure that:<br />
              <ul :style="{ marginBottom: '0' }">
                <li>
                  The implementation address of the logic contract is supported
                </li>
                <li>You are not the admin of the proxy contract</li>
              </ul>
            </span>
          </a-alert>

          <a-tabs v-else>
            <a-tab-pane key="1">
              <span slot="tab">
                <a-icon type="info" />
                Information
              </span>

              <span>
                <p>
                  Name: {{ savedContract.information.name }}
                  <br />
                  Symbol: {{ savedContract.information.symbol }}
                  <br />
                  <span v-if="savedContract.information.decimals">
                    Decimals: {{ savedContract.information.decimals }}
                  </span>
                </p>
                <p>Total supply: {{ savedContract.information.totalSupply }}</p>

                <a-divider>Get balance</a-divider>
                <a-form
                  layout="inline"
                  style="text-align: center"
                  :form="contractForms[index]"
                  @submit.prevent="handleGetBalance(index, savedContract)"
                >
                  <a-form-item label="Address">
                    <a-input
                      placeholder="e.g. 0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975043"
                      v-decorator="[
                        'address',
                        {
                          rules: [
                            {
                              required: true,
                              whitespace: true,
                              message: 'Please input an address'
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
                      Get balance
                    </a-button>
                  </a-form-item>
                </a-form>
              </span>
            </a-tab-pane>

            <a-tab-pane key="2">
              <span slot="tab">
                <a-icon type="file-protect" />
                Source code
              </span>
              <pre class="code"
                >{{ logicContracts[savedContract.name].source }}
              </pre>
            </a-tab-pane>

            <a-tab-pane key="3">
              <span slot="tab">
                <a-icon type="code" />
                ABI
              </span>
              <pre class="code"
                >{{ logicContracts[savedContract.name].abi }}
              </pre>
            </a-tab-pane>
          </a-tabs>
        </a-collapse-panel>
      </a-collapse>

      <a-alert
        v-else
        message="You don't have any saved contracts. Save one now with the form above"
        type="info"
        showIcon
      />
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
const web3 = new Web3(window.ethereum);

import StandaloneERC20 from "@/../contracts/flattened-resources/StandaloneERC20.sol";
import StandaloneERC721 from "@/../contracts/flattened-resources/StandaloneERC721.sol";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "Contracts",
  data() {
    return {
      contractForms: [],
      logicContracts: {
        StandaloneERC20,
        StandaloneERC721
      }
    };
  },
  computed: {
    ...mapGetters([
      "supportedImplementations",
      "loadingAllContracts",
      "loadingSavedContracts",
      "savedContracts"
    ])
  },
  watch: {
    async loadingAllContracts(isLoading) {
      if (!isLoading) this.setupComponent();
    }
  },
  methods: {
    ...mapActions(["saveSmartContract", "fetchSavedContracts", "getBalance"]),
    async setupComponent() {
      await this.fetchSavedContracts();

      let forms = [];
      for (let index in this.savedContracts) {
        forms[index] = this.$form.createForm(this);
      }
      this.contractForms = forms;
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
    handleSavePublicContract() {
      this.savePublicContractForm.validateFields(async (err, values) => {
        if (!err) {
          let message = this.$message.loading(
            "Saving public contract, please confirm transaction on Metamask",
            0
          );

          try {
            const txHash = await this.saveSmartContract({
              contractAddress: values.address,
              contractName: values.supportedContract
            });
            setTimeout(message, 0);
            this.$notification.success({
              message: "Public smart contract saved!",
              description: `The public smart contract has been saved for you, the transaction hash is: ${txHash}`,
              duration: 0,
              style: {
                width: "600px",
                marginLeft: "-220px",
                marginTop: "25px"
              }
            });
            this.savePublicContractForm.resetFields();
          } catch (error) {
            setTimeout(message, 0);
            let defaultMessage = "Public smart contract could not be saved";
            if (error.message.includes("User denied transaction signature")) {
              this.$message.error(`Transaction rejected. ${defaultMessage}`);
            } else {
              this.$message.error(defaultMessage);
            }
          }
        }
      });
    },
    async handleGetBalance(index, contract) {
      this.contractForms[index].validateFields(async (err, values) => {
        if (!err) {
          const balance = await this.getBalance({
            contract,
            balanceAddress: values.address
          });
          this.$notification.info({
            message: "Balance",
            description: `The balance of ${values.address} is: ${balance}`,
            style: {
              width: "600px",
              marginLeft: "-220px",
              marginTop: "25px"
            }
          });
          this.contractForms[index].resetFields();
        }
      });
    }
  },
  beforeCreate() {
    this.savePublicContractForm = this.$form.createForm(this);
  },
  mounted() {
    if (!this.loadingAllContracts) this.setupComponent();
  }
};
</script>
