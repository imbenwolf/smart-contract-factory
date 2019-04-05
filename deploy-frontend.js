const shell = require("shelljs");

const startTime = Date.now();

const api = "https://api.scapp-console.swisscom.com";
const org = "GHR-OSA-NEX-21_mr.wolf";

let space, app, hostname;

const deploymentEnv = process.argv[2];
switch (deploymentEnv) {
  case "testing":
    space = "factory-test";
    app = "smart-contract-factory-testing";
    hostname = "test-factory";
    break;
  case "production":
    space = "factory-prod";
    app = "smart-contract-factory-production";
    hostname = "factory";
    break;
  default:
    console.error(
      "ERROR: Undefined deployment environment (only 'testing' and 'production' at the moment)"
    );
    process.exit(1);
}

// Exit script if any command fails
shell.config.fatal = true;

// Set correct api endpoint
shell.exec(`cf api ${api}`);

// Change to correct space
shell.exec(`cf target -o ${org} -s ${space}`);

// Deploy (needs to be build first)
shell.exec(`cf push ${app} -n ${hostname} -d scapp.swisscom.com`);

// Evaluate time passed
let secondsPassed = Math.floor((Date.now() - startTime) / 1000);
shell.echo(`Deployment took ${secondsPassed} seconds.`);

shell.echo("Everything seems to be fine!");
