const migrationsHelper = require("./migrations-helper");
const CONTRACT_NAME = "SmartContractFactory";

function addSmartContractFactory(networkName, accounts) {
  let addContract = migrationsHelper.addContract(
    CONTRACT_NAME,
    networkName,
    accounts
  );
  if (addContract.code !== 0) throw new Error("Migration failed");
}

function createSmartContractFactory(networkName, accounts, args) {
  let create = migrationsHelper.createContract(
    CONTRACT_NAME,
    networkName,
    accounts,
    [args]
  );
  if (create.code !== 0) throw new Error("Migration failed");
}

function deploySmartContractFactory(networkName, accounts) {
  let update = migrationsHelper.updateContract(
    CONTRACT_NAME,
    networkName,
    accounts
  );
  if (
    update.stderr &&
    update.stderr.includes(
      "No contract instances that match contract",
      "were found"
    )
  ) {
    createSmartContractFactory(networkName, accounts, "okok");
  } else if (update.code !== 0) {
    throw new Error("Migration failed");
  }
}

module.exports = function(deployer, networkName, accounts) {
  deployer.then(() => {
    addSmartContractFactory(networkName, accounts);
    deploySmartContractFactory(networkName, accounts);
  });
};
