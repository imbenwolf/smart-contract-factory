# Smart Contract Factory

## Install dependencies
```
yarn
```

## Project setup

Install dependencies as described under [Install dependencies](#install-dependencies).

### Runs development Ethereum blockchain

Runs a development Ethereum blockchain network under ```127.0.0.1:8545``` with the network id ```80085```.

```
yarn ethereum
```

Additional options: https://github.com/trufflesuite/ganache-cli#using-ganache-cli

### Compiles and hot-reloads for development

**Run development ethereum blockchain as described under [Runs development ethereum blockchain](#runs-development-ethereum-blockchain).**

```
yarn serve
```

### Migrates backend smart contracts

```
yarn migrate:backend
```

To migrate to a public network, use the option ```--network <name>``` \
Note that the respective network configuration must be present inside the ```truffle-config.js``` file.

Additional options: https://truffleframework.com/docs/truffle/reference/truffle-commands#migrate

### Compiles and minifies frontend for production

Due to a limitation by a used Truffle dependency, a development Ethereum blockchain needs to be running:\
**Run development ethereum blockchain as described under [Runs development ethereum blockchain](#runs-development-ethereum-blockchain).**

```
yarn build:frontend
```

### Deploys frontend on the [Swisscom Application Cloud](https://developer.swisscom.com/)

**Build the frontend as described under [Compiles and minifies frontend for production](#compiles-and-minifies-frontend-for-production).**

Make sure you have access to the application cloud space defined in ```deploy-frontend.js``` or modify it to your needs.

```
yarn deploy:frontend <environment>
```

Currently, two environments are available: ```testing``` and ```production```.

### Lints vue files
```
yarn lint:vue
```

### Lints solidity files
```
yarn lint:solidity
```

### Runs backend smart contracts tests
```
yarn test:backend
```

### Runs backend smart contracts tests with coverage report
```
yarn coverage:backend
```