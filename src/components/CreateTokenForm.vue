<template>
  <a-form
    :style="{ marginTop: '16px' }"
    :form="form"
    @submit.prevent="handleSubmit"
  >
    <a-form-item label="Name" v-bind="formItemLayout">
      <a-input
        v-decorator="[
          'name',
          {
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please input the name of the token!'
              }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayout">
      <span slot="label">
        Symbol
        <a-tooltip
          title="What should be the symbol of the token? (imagine it like CHF, USD)"
        >
          <a-icon type="question-circle" />
        </a-tooltip>
      </span>
      <a-input
        v-decorator="[
          'symbol',
          {
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Please input the symbol of the token!'
              },
              {
                pattern: /^[A-Z]{3,4}$/,
                message: 'Symbol must be all uppercase and 3-4 characters long'
              }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" v-if="tokenStandard === 'ERC20'">
      <span slot="label">
        Decimals
        <a-tooltip
          title="How many decimals should the token have? (USD has 3 - 100 cents is 1$)"
        >
          <a-icon type="question-circle-o" />
        </a-tooltip>
      </span>
      <a-input-number
        :min="0"
        :max="20"
        style="width: 100%;"
        v-decorator="[
          'decimals',
          {
            rules: [
              {
                required: true,
                type: 'integer',
                message: 'Please input number of decimals for the token!'
              }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item
      :style="{ 'text-align': 'center' }"
      v-bind="formItemLayout"
      v-if="tokenStandard === 'ERC20'"
    >
      <span slot="label">
        Initial tokens
        <a-tooltip
          title="Do you want to give an account an intital amount of tokens?"
        >
          <a-icon type="question-circle-o" />
        </a-tooltip>
      </span>
      <a-radio-group
        v-decorator="[
          'initialTokens',
          {
            rules: [
              {
                required: true,
                message: 'Please choose if you want initial tokens!'
              }
            ],
            initialValue: false
          }
        ]"
      >
        <a-radio :value="true">
          Yes
        </a-radio>
        <a-radio :value="false">
          No
        </a-radio>
      </a-radio-group>
    </a-form-item>
    <transition name="slide-fade">
      <div v-if="form.getFieldValue('initialTokens')">
        <a-form-item label="Initial value" v-bind="formItemLayout">
          <a-input-number
            style="width: 100%"
            v-decorator="[
              'initialNumberOfTokens',
              {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: 'Please input initial number of tokens!'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="Initial holder" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'initialHolderOfTokens',
              {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please input holder address of initial tokens'
                  },
                  {
                    validator: validateEthereumAddressOrEmpty
                  }
                ]
              }
            ]"
          />
        </a-form-item>
      </div>
    </transition>
    <transition-group name="slide-fade">
      <a-form-item
        :style="{ marginBottom: '8px' }"
        v-for="(id, index) in form.getFieldValue('minterIds')"
        :key="`minter-${id}`"
        v-bind="index === 0 ? formItemLayout : tailFormItemLayout"
      >
        <span v-if="index === 0" slot="label">
          Minters
          <a-tooltip
            title="Optionally, add addresses that will have the ability to increase the number of tokens"
          >
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input
          v-decorator="[
            `minters[${id}]`,
            {
              validateTrigger: ['change', 'blur'],
              preserve: true,
              rules: [
                {
                  validator: validateEthereumAddressOrEmpty
                },
                {
                  validator: validateMinterNotAlreadyAdded
                }
              ]
            }
          ]"
          placeholder="Minter address"
          :style="
            form.getFieldValue('minterIds').length > 1
              ? {
                  width: 'calc(100% - 22px)',
                  'margin-right': '8px',
                  transition: 'width 0s'
                }
              : {}
          "
        />
        <a-icon
          v-if="form.getFieldValue('minterIds').length > 1"
          class="dynamic-delete-button"
          type="minus-circle-o"
          @click="removeMinterField(id)"
        />
      </a-form-item>
    </transition-group>
    <a-form-item v-bind="tailFormItemLayout">
      <a-button type="dashed" style="width: 100%" @click="addMinterField()">
        <a-icon type="plus" /> Add minter
      </a-button>
    </a-form-item>
    <transition-group name="slide-fade">
      <a-form-item
        :style="{ marginBottom: '8px' }"
        v-for="(id, index) in form.getFieldValue('pauserIds')"
        :key="`pauser-${id}`"
        v-bind="index === 0 ? formItemLayout : tailFormItemLayout"
      >
        <span v-if="index === 0" slot="label">
          Pausers
          <a-tooltip
            title="Optionally, add addresses that will have the ability to pause and unpause all token functionality (imagine it as an emergency stop mechanism)"
          >
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input
          v-decorator="[
            `pausers[${id}]`,
            {
              validateTrigger: ['change', 'blur'],
              preserve: true,
              rules: [
                {
                  validator: validateEthereumAddressOrEmpty
                },
                {
                  validator: validatePauserNotAlreadyAdded
                }
              ]
            }
          ]"
          placeholder="Pauser address"
          :style="
            form.getFieldValue('pauserIds').length > 1
              ? {
                  width: 'calc(100% - 22px)',
                  'margin-right': '8px',
                  transition: 'width 0s'
                }
              : {}
          "
        />
        <a-icon
          v-if="form.getFieldValue('pauserIds').length > 1"
          class="dynamic-delete-button"
          type="minus-circle"
          @click="removePauserField(id)"
        />
      </a-form-item>
    </transition-group>
    <a-form-item v-bind="tailFormItemLayout">
      <a-button type="dashed" style="width: 100%" @click="addPauserField()">
        <a-icon type="plus" /> Add pauser
      </a-button>
    </a-form-item>
    <a-form-item v-bind="tailFormItemLayout">
      <a-button type="primary" html-type="submit">
        Create
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
const tokenStandards = ["ERC20", "ERC721"];

let minterId = 0;
let pauserId = 0;

export default {
  name: "CreateTokenForm",
  props: {
    tokenStandard: {
      type: String,
      required: true,
      validator: tokenStandard => tokenStandards.includes(tokenStandard)
    }
  },
  data() {
    return {
      formItemLayout: {
        labelCol: {
          sm: { span: 24 },
          md: { span: 6 },
          lg: { span: 4, offset: 5 },
          xl: { span: 4, offset: 5 }
        },
        wrapperCol: {
          sm: { span: 24 },
          md: { span: 16 },
          lg: { span: 10 },
          xl: { span: 6 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          sm: {
            span: 24,
            offset: 0
          },
          md: {
            span: 16,
            offset: 6
          },
          lg: {
            span: 10,
            offset: 9
          },
          xl: {
            span: 6,
            offset: 9
          }
        }
      }
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
    validateMinterNotAlreadyAdded(rule, value, callback) {
      let minters = this.extractMintersByIds();
      let minterAlreadyExists =
        minters.filter(minter => minter === value).length > 1;
      if (minterAlreadyExists)
        callback(
          "This minter has already been added, change the address or delete this field"
        );
      else callback();
    },
    validatePauserNotAlreadyAdded(rule, value, callback) {
      let pausers = this.extractPausersByIds();
      let pauserAlreadyExists =
        pausers.filter(pauser => pauser === value).length > 1;
      if (pauserAlreadyExists)
        callback(
          "This pauser has already been added, change the address or delete this field"
        );
      else callback();
    },
    addMinterField() {
      const { form } = this;
      const minterIds = form.getFieldValue("minterIds");
      const newMinterIds = minterIds.concat(++minterId);
      form.setFieldsValue({
        minterIds: newMinterIds
      });
    },
    addPauserField() {
      const { form } = this;
      const pauserIds = form.getFieldValue("pauserIds");
      const newPauserIds = pauserIds.concat(++pauserId);

      form.setFieldsValue({
        pauserIds: newPauserIds
      });
    },
    removeMinterField(id) {
      const { form } = this;
      const minterIds = form.getFieldValue("minterIds");
      form.setFieldsValue({
        minterIds: minterIds.filter(minterId => minterId !== id)
      });
      this.$nextTick(() => {
        this.form.validateFields(["minters"], { force: true }, () => {});
      });
    },
    removePauserField(id) {
      const { form } = this;
      const pauserIds = form.getFieldValue("pauserIds");
      form.setFieldsValue({
        pauserIds: pauserIds.filter(pauserId => pauserId !== id)
      });
      this.$nextTick(() => {
        this.form.validateFields(["pausers"], { force: true }, () => {});
      });
    },
    extractPausersByIds() {
      const { form } = this;
      const ids = form.getFieldValue("pauserIds");
      const pausers = form.getFieldValue("pausers");
      let extractedPausers = [];
      if (ids && pausers) {
        for (let id of ids) {
          let pauser = pausers[id];
          if (pauser) extractedPausers.push(pauser);
        }
      }
      return extractedPausers;
    },
    extractMintersByIds() {
      const { form } = this;
      const ids = form.getFieldValue("minterIds");
      const minters = form.getFieldValue("minters");
      let extractedMinters = [];
      if (ids && minters) {
        for (let id of ids) {
          let minter = minters[id];
          if (minter) extractedMinters.push(minter);
        }
      }
      return extractedMinters;
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let result = {
            name: values.name,
            symbol: values.symbol,
            decimals: values.decimals,
            minters: this.extractMintersByIds(),
            pausers: this.extractPausersByIds()
          };

          if (values.initialTokens) {
            result.initialNumberOfTokens = values.initialNumberOfTokens;
            result.initialHolderOfTokens = values.initialHolderOfTokens;
          }

          this.$emit("create-token", {
            tokenStandard: this.tokenStandard,
            data: result
          });
        }
      });
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
    this.form.getFieldDecorator("minterIds", {
      initialValue: [minterId],
      preserve: true
    });
    this.form.getFieldDecorator("pauserIds", {
      initialValue: [pauserId],
      preserve: true
    });
  }
};
</script>
