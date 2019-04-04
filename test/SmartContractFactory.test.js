/* global web3, contract, beforeEach, context, it */

require("./helpers/setup");
const { TestHelper } = require("zos");
const { Contracts, ZWeb3, assertRevert, encodeCall } = require("zos-lib");

ZWeb3.initialize(web3.currentProvider);

const SmartContractFactory = Contracts.getFromLocal("SmartContractFactory");
const StandaloneERC721 = Contracts.getFromNodeModules(
  "openzeppelin-eth",
  "StandaloneERC721"
);

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

  context("contract storage", async () => {
    const ERC721Contract = "StandaloneERC721";
    const ERC721Name = "CoolToken";
    const ERC721Symbol = "COOL";

    beforeEach(async () => {
      let data = encodeCall(
        "initialize",
        ["string", "string", "address[]", "address[]"],
        [ERC721Name, ERC721Symbol, [], []]
      );

      await this.smartContractFactory.methods
        .createSmartContract(ERC721Contract, data)
        .send({ from: accounts[1], gas: 1500000 });
    });

    it("should get number of contracts", async () => {
      let numberOfContracts = await this.smartContractFactory.methods
        .getNumberOfContracts()
        .call({ from: accounts[1] });

      numberOfContracts.should.be.eq.BN(1);
    });

    it("should get contract by key", async () => {
      let numberOfContracts = await this.smartContractFactory.methods
        .getNumberOfContracts()
        .call({ from: accounts[1] });

      let contract = await this.smartContractFactory.methods
        .getContract(numberOfContracts - 1)
        .call({ from: accounts[1] });

      let contractAddress = contract[0];
      let contractName = contract[1];
      let isContractAdmin = contract[2];

      let userERC721 = await StandaloneERC721.at(contractAddress);
      let userERC721Name = await userERC721.methods.name().call();
      let userERC721Symbol = await userERC721.methods.symbol().call();
      contractName.should.be.equal(ERC721Contract);
      isContractAdmin.should.be.true;
      userERC721Name.should.be.equal(ERC721Name);
      userERC721Symbol.should.be.equal(ERC721Symbol);
    });

    it("should not save unsupported contract as user", async () => {
      await assertRevert(
        this.smartContractFactory.methods
          .saveSmartContract(emptyAddress, "MyContract")
          .send({ from: accounts[0], gas: 100000 })
      );
    });

    it("should save supported contract as user", async () => {
      await this.smartContractFactory.methods
        .saveSmartContract(emptyAddress, ERC721Contract)
        .send({ from: accounts[0], gas: 100000 });

      let numberOfContractsOfUser = await this.smartContractFactory.methods
        .getNumberOfContracts()
        .call({ from: accounts[0] });

      numberOfContractsOfUser.should.be.eq.BN(1);
    });
  });
});
