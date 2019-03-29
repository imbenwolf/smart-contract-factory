const shell = require("shelljs");

function addContract(contractName, networkName, accounts) {
  return shell.exec(
    `yarn zos add ${contractName} --push ${networkName} --from ${accounts[0]}`
  );
}

function updateContract(contractName, networkName, accounts) {
  return shell.exec(
    `yarn zos update ${contractName} --network ${networkName} --from ${
      accounts[0]
    }`
  );
}

function createContract(contractName, networkName, accounts, args) {
  return shell.exec(
    `yarn zos create ${contractName} --init ${
      args ? "--args " + args.join().replace(/\s/g, "") : ""
    } --network ${networkName} --from ${accounts[0]}`
  );
}

module.exports = {
  addContract,
  updateContract,
  createContract
};
