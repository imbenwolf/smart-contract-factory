/*global web3, contract, beforeEach, context, it*/

const chai = require("chai");
const should = chai.should(); // eslint-disable-line no-unused-vars
const { TestHelper } = require("zos");
const { Contracts, ZWeb3, assertRevert } = require("zos-lib");

ZWeb3.initialize(web3.currentProvider);

const SmartContractFactory = Contracts.getFromLocal("SmartContractFactory");

const emptyAddress = "0x0000000000000000000000000000000000000000";

contract("SmartContractFactory", () => {
  beforeEach(async () => {
    let project = await TestHelper();
    this.smartContractFactory = await project.createProxy(
      SmartContractFactory,
      {
        initMethod: "initialize",
        initArgs: [project.getApp().address]
      }
    );
  });

  context("get implementation", async () => {
    it("should not return implementation address of unsupported contract", async () => {
      await assertRevert(
        this.smartContractFactory.methods.getImplementation("MyContract").call()
      );
    });

    it("should return implementation address of erc20 contract", async () => {
      let implementation = await this.smartContractFactory.methods
        .getImplementation("StandaloneERC20")
        .call();

      let isImplementationAdress = web3.utils.isAddress(implementation);
      isImplementationAdress.should.be.true;
      implementation.should.not.be.equal(emptyAddress);
    });

    it("should return implementation address of erc721 contract", async () => {
      let implementation = await this.smartContractFactory.methods
        .getImplementation("StandaloneERC721")
        .call();

      let isImplementationAdress = web3.utils.isAddress(implementation);
      isImplementationAdress.should.be.true;
      implementation.should.not.be.equal(emptyAddress);
    });
  });
});
