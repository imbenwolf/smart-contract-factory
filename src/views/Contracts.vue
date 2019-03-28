<template>
  <div class="content">
    <a-divider>Save public contract</a-divider>
    <a-form
      layout="inline"
      style="text-align: center"
      :form="savePublicContractForm"
      @submit.prevent="handleSavePublicContract"
    >
      <a-form-item label="Address">
        <a-input
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
            v-for="supportedContract in supportedContracts"
            :key="supportedContract.name"
            >{{ supportedContract.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">
          Save
        </a-button>
      </a-form-item>
    </a-form>

    <div class="overview">
      <a-skeleton v-if="loading" active :paragraph="{ rows: 10 }" />
      <a-collapse v-else-if="contracts.length > 0" :bordered="false">
        <a-collapse-panel v-for="contract in contracts" :key="contract.address">
          <template slot="header">
            <a-row>
              <a-col :span="12">{{ contract.address }}</a-col>
              <a-col :span="11" :style="{ 'text-align': 'right' }">{{
                contract.name
              }}</a-col>
            </a-row>
          </template>
          <div>
            <p :style="{ margin: 0 }">Logic contract for:</p>
            <h2 :style="{ 'margin-bottom': '25px' }">{{ contract.name }}</h2>

            <a-tabs>
              <a-tab-pane key="1">
                <span slot="tab">
                  <a-icon type="info" />
                  Information
                </span>
                <p>
                  Name: {{ contract.tokenName }}
                  <br />
                  <span v-if="contract.tokenSymbol">
                    Symbol: {{ contract.tokenSymbol }}
                  </span>
                  <br />
                  <span v-if="contract.tokenDecimals">
                    Decimals: {{ contract.tokenDecimals }}
                  </span>
                </p>

                <p>Total supply: {{ contract.tokenTotalSupply }}</p>

                <a-divider>Get balance</a-divider>
                <a-form
                  layout="inline"
                  style="text-align: center"
                  :form="contractForms[contract.address]"
                  @submit.prevent="handleGetBalance(contract)"
                >
                  <a-form-item label="Address">
                    <a-input
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
              </a-tab-pane>
              <a-tab-pane key="2">
                <span slot="tab">
                  <a-icon type="file-protect" />
                  Source code
                </span>
                <pre class="code">{{
                  getContractWithName(contract.name).sourceCode
                }}</pre>
              </a-tab-pane>
              <a-tab-pane key="3">
                <span slot="tab">
                  <a-icon type="code" />
                  ABI
                </span>
                <pre class="code">{{
                  getContractWithName(contract.name).abi
                }}</pre>
              </a-tab-pane>
            </a-tabs>
          </div>
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
export default {
  name: "Contracts",
  data() {
    return {
      loading: true,
      contractForms: [],
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
      contracts: [
        {
          name: "ERC20",
          address: "0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975041",
          tokenName: "MockedCoin",
          tokenSymbol: "MKC",
          tokenDecimals: 5,
          tokenTotalSupply: 123
        },
        {
          name: "ERC20",
          address: "0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975042",
          tokenName: "MockedCoin",
          tokenSymbol: "MKC",
          tokenDecimals: 5,
          tokenTotalSupply: 123
        },
        {
          name: "ERC721",
          address: "0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975043",
          tokenName: "MockedCoin",
          tokenSymbol: "MKC",
          tokenTotalSupply: 123
        },
        {
          name: "ERC20",
          address: "0xfE1Ceec0bFc28Db1814A18A6fE6c6dB553975044",
          tokenName: "MockedCoin",
          tokenSymbol: "MKC",
          tokenDecimals: 5,
          tokenTotalSupply: 123
        }
      ]
    };
  },
  methods: {
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
    handleSavePublicContract() {
      this.savePublicContractForm.validateFields(async (err, values) => {
        if (!err) {
          console.log(values);

          let message = this.$message.loading(
            "Saving public contract, please confirm transaction on Metamask",
            0
          );
          setTimeout(() => {
            setTimeout(message, 0);
            this.$notification.success({
              message: "Public smart contract saved!",
              description:
                "The public smart contract has been saved for you, the transaction hash is: XY",
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
    },
    handleGetBalance(contract) {
      this.contractForms[contract.address].validateFields(
        async (err, values) => {
          if (!err) {
            console.log(contract);
            console.log(values);

            this.$notification.info({
              message: "Balance",
              description: `The balance of ${values.address} is: 0`,
              style: {
                width: "600px",
                marginLeft: "-220px",
                marginTop: "25px"
              }
            });
          }
        }
      );
    },
    getContractWithName(name) {
      return {
        sourceCode: name,
        abi: "abi"
      };
    }
  },
  created() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    this.savePublicContractForm = this.$form.createForm(this);
    for (let contract of this.contracts) {
      this.contractForms[contract.address] = this.$form.createForm(this);
    }
  }
};
</script>

<style scoped>
.overview {
  margin-top: 48px;
}
</style>
