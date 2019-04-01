const shell = require("shelljs");

function addContract(contractName, accounts) {
  return shell.exec(`yarn zos add ${contractName} --from ${accounts[0]}`);
}

function pushContract(networkName, accounts, isDevelopment) {
  return shell.exec(
    `yarn zos push --skip-compile --network ${networkName} --from ${
      accounts[0]
    } ${isDevelopment ? "--force --deploy-dependencies" : ""}`
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
  pushContract,
  updateContract,
  createContract
};
