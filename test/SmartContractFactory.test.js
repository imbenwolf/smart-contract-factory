/* global web3, contract, beforeEach, context, it */

require("./helpers/setup");
const { TestHelper } = require("zos");
const { Contracts, ZWeb3, assertRevert, encodeCall } = require("zos-lib");

ZWeb3.initialize(web3.currentProvider);

const SmartContractFactory = Contracts.getFromLocal("SmartContractFactory");

const emptyAddress = "0x0000000000000000000000000000000000000000";

contract("SmartContractFactory", accounts => {
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

  context("create contract", async () => {
    it("should not create unsupported contract", async () => {
      let data = encodeCall("initialize", ["string"], ["my contract"]);
      await assertRevert(
        this.smartContractFactory.methods
          .createSmartContract("MyContract", data)
          .send({ from: accounts[1], gas: 1500000 })
      );
    });

    it("should not create supported contract with empty data", async () => {
      await assertRevert(
        this.smartContractFactory.methods
          .createSmartContract("StandaloneERC20", [])
          .send({ from: accounts[1], gas: 1500000 })
      );
    });

    it("should create a new erc20 token", async () => {
      let ERC20Name = "CoolToken";
      let ERC20Symbol = "COOL";
      let data = encodeCall(
        "initialize",
        ["string", "string", "uint8", "address[]", "address[]"],
        [ERC20Name, ERC20Symbol, 18, [], []]
      );

      await this.smartContractFactory.methods
        .createSmartContract("StandaloneERC20", data)
        .send({ from: accounts[1], gas: 1500000 });

      let numberOfContracts = await this.smartContractFactory.methods
        .getNumberOfContracts()
        .call({ from: accounts[1] });

      numberOfContracts.should.be.eq.BN(1);
    });

    it("should create a new erc721 token", async () => {
      let ERC721Name = "CoolToken";
      let ERC721Symbol = "COOL";
      let data = encodeCall(
        "initialize",
        ["string", "string", "address[]", "address[]"],
        [ERC721Name, ERC721Symbol, [], []]
      );

      await this.smartContractFactory.methods
        .createSmartContract("StandaloneERC721", data)
        .send({ from: accounts[1], gas: 1500000 });

      let numberOfContracts = await this.smartContractFactory.methods
        .getNumberOfContracts()
        .call({ from: accounts[1] });

      numberOfContracts.should.be.eq.BN(1);
    });
  });
});
