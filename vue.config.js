module.exports = {
  chainWebpack: config => {
    // Solidity Loader
    config.module
      .rule("solidity")
      .test(/\.sol/)
      .use("json-loader")
      .loader("json-loader")
      .end()
      .use("truffle-solidity-loader")
      .loader("truffle-solidity-loader")
      .tap(() => {
        return {
          network: "development"
        };
      })
      .end();
  }
};
