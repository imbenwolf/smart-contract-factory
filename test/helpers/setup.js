const chai = require("chai");
const BN = require("bn.js");

const should = chai.use(require("bn-chai")(BN)).should();

module.exports = {
  BN,
  should
};
