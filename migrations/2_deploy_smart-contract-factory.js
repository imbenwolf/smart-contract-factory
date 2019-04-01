const zeppelinosHelper = require("./zeppelinos-helper");
const CONTRACT_NAME = "SmartContractFactory";

function addSmartContractFactory(networkName, accounts) {
  let addContract = zeppelinosHelper.addContract(
    CONTRACT_NAME,
    networkName,
    accounts
  );
  if (addContract.code !== 0) throw new Error("Migration failed");
}

function pushSmartContractFactory(networkName, accounts) {
  const isDevelopment = networkName === "development";

  let push = zeppelinosHelper.pushContract(
    networkName,
    accounts,
    isDevelopment
  );
  if (push.code !== 0) throw new Error("Migration failed");
}

function createSmartContractFactory(networkName, accounts) {
  let zosDataIdentifier = networkName;
  if (networkName === "development") zosDataIdentifier = "dev-80085"; // Pre-defined networkId 80085
  const appAddress = require(`../zos.${zosDataIdentifier}.json`).app.address;

  let create = zeppelinosHelper.createContract(
    CONTRACT_NAME,
    networkName,
    accounts,
    [appAddress]
  );
  if (create.code !== 0) throw new Error("Migration failed");
}

function deploySmartContractFactory(networkName, accounts) {
  let update = zeppelinosHelper.updateContract(
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
    createSmartContractFactory(networkName, accounts);
  } else if (update.code !== 0) {
    throw new Error("Migration failed");
  }
}

module.exports = function(deployer, networkName, accounts) {
  deployer.then(() => {
    addSmartContractFactory(networkName, accounts);
    pushSmartContractFactory(networkName, accounts);
    deploySmartContractFactory(networkName, accounts);
  });
};
