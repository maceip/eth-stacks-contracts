import { expect } from "chai";
import { ethers } from "hardhat";
import hre from "hardhat";
import { TokenboundClient } from '@tokenbound/sdk';
import { FinanceNFT, FinanceNFTFactory } from "../typechain-types";

const registryAddress = "0x02101dfB77FDE026414827Fdc604ddAF224F0921";
const registryABI = [{"inputs":[],"name":"InitializationFailed","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"address","name":"implementation","type":"address"},{"indexed":false,"internalType":"uint256","name":"chainId","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenContract","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"salt","type":"uint256"}],"name":"AccountCreated","type":"event"},{"inputs":[{"internalType":"address","name":"implementation","type":"address"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"tokenContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"}],"name":"account","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"implementation","type":"address"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"tokenContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"initData","type":"bytes"}],"name":"createAccount","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"}];
const tbaImplementationAddress = "0x2d25602551487c3f3354dd80d76d54383a243358";

const accountABI = [{"inputs":[{"internalType":"address","name":"_guardian","type":"address"},{"internalType":"address","name":"entryPoint_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AccountLocked","type":"error"},{"inputs":[],"name":"ExceedsMaxLockTime","type":"error"},{"inputs":[],"name":"InvalidInput","type":"error"},{"inputs":[],"name":"NotAuthorized","type":"error"},{"inputs":[],"name":"OwnershipCycle","type":"error"},{"inputs":[],"name":"UntrustedImplementation","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"lockedUntil","type":"uint256"}],"name":"LockUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"bytes4","name":"selector","type":"bytes4"},{"indexed":false,"internalType":"address","name":"implementation","type":"address"}],"name":"OverrideUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"bool","name":"hasPermission","type":"bool"}],"name":"PermissionUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":true,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"TransactionExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"_entryPoint","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"entryPoint","outputs":[{"internalType":"contract IEntryPoint","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"executeCall","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"guardian","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"caller","type":"address"}],"name":"isAuthorized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isLocked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"internalType":"bytes4","name":"magicValue","type":"bytes4"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_lockedUntil","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lockedUntil","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"receivedTokenId","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bytes4","name":"","type":"bytes4"}],"name":"overrides","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"permissions","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4[]","name":"selectors","type":"bytes4[]"},{"internalType":"address[]","name":"implementations","type":"address[]"}],"name":"setOverrides","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"callers","type":"address[]"},{"internalType":"bool[]","name":"_permissions","type":"bool[]"}],"name":"setPermissions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"tokenContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"initCode","type":"bytes"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"uint256","name":"callGasLimit","type":"uint256"},{"internalType":"uint256","name":"verificationGasLimit","type":"uint256"},{"internalType":"uint256","name":"preVerificationGas","type":"uint256"},{"internalType":"uint256","name":"maxFeePerGas","type":"uint256"},{"internalType":"uint256","name":"maxPriorityFeePerGas","type":"uint256"},{"internalType":"bytes","name":"paymasterAndData","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct UserOperation","name":"userOp","type":"tuple"},{"internalType":"bytes32","name":"userOpHash","type":"bytes32"},{"internalType":"uint256","name":"missingAccountFunds","type":"uint256"}],"name":"validateUserOp","outputs":[{"internalType":"uint256","name":"validationData","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

const tokenABI = [
  {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
          {
              "name": "",
              "type": "string"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_spender",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_from",
              "type": "address"
          },
          {
              "name": "_to",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "transferFrom",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
          {
              "name": "",
              "type": "uint8"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "_owner",
              "type": "address"
          }
      ],
      "name": "balanceOf",
      "outputs": [
          {
              "name": "balance",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
          {
              "name": "",
              "type": "string"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_to",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "transfer",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "_owner",
              "type": "address"
          },
          {
              "name": "_spender",
              "type": "address"
          }
      ],
      "name": "allowance",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "spender",
              "type": "address"
          },
          {
              "indexed": false,
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Approval",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "from",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "to",
              "type": "address"
          },
          {
              "indexed": false,
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Transfer",
      "type": "event"
  }
];

const poolABI = [
  {
      "inputs": [
          {
              "internalType": "contract IPoolAddressesProvider",
              "name": "provider",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "reserve",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "backer",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
          }
      ],
      "name": "BackUnbacked",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "reserve",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "onBehalfOf",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "enum DataTypes.InterestRateMode",
              "name": "interestRateMode",
              "type": "uint8"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "borrowRate",
              "type": "uint256"
          },
          {
              "indexed": true,
              "internalType": "uint16",
              "name": "referralCode",
              "type": "uint16"
          }
      ],
      "name": "Borrow",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "target",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "initiator",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "enum DataTypes.InterestRateMode",
              "name": "interestRateMode",
              "type": "uint8"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "premium",
              "type": "uint256"
          },
          {
              "indexed": true,
              "internalType": "uint16",
              "name": "referralCode",
              "type": "uint16"
          }
      ],
      "name": "FlashLoan",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "totalDebt",
              "type": "uint256"
          }
      ],
      "name": "IsolationModeTotalDebtUpdated",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "collateralAsset",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "debtAsset",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "debtToCover",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "liquidatedCollateralAmount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "liquidator",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "bool",
              "name": "receiveAToken",
              "type": "bool"
          }
      ],
      "name": "LiquidationCall",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "reserve",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "onBehalfOf",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "indexed": true,
              "internalType": "uint16",
              "name": "referralCode",
              "type": "uint16"
          }
      ],
      "name": "MintUnbacked",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "reserve",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amountMinted",
              "type": "uint256"
          }
      ],
      "name": "MintedToTreasury",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "reserve",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          }
      ],
      "name": "RebalanceStableBorrowRate",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "reserve",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "repayer",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "bool",
              "name": "useATokens",
              "type": "bool"
          }
      ],
      "name": "Repay",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "reserve",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "liquidityRate",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "stableBorrowRate",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "variableBorrowRate",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "liquidityIndex",
              "type": "uint256"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "variableBorrowIndex",
              "type": "uint256"
          }
      ],
      "name": "ReserveDataUpdated",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "reserve",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          }
      ],
      "name": "ReserveUsedAsCollateralDisabled",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "reserve",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          }
      ],
      "name": "ReserveUsedAsCollateralEnabled",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "reserve",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "onBehalfOf",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "indexed": true,
              "internalType": "uint16",
              "name": "referralCode",
              "type": "uint16"
          }
      ],
      "name": "Supply",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "reserve",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "enum DataTypes.InterestRateMode",
              "name": "interestRateMode",
              "type": "uint8"
          }
      ],
      "name": "SwapBorrowRateMode",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint8",
              "name": "categoryId",
              "type": "uint8"
          }
      ],
      "name": "UserEModeSet",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "reserve",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          }
      ],
      "name": "Withdraw",
      "type": "event"
  },
  {
      "inputs": [],
      "name": "ADDRESSES_PROVIDER",
      "outputs": [
          {
              "internalType": "contract IPoolAddressesProvider",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "BRIDGE_PROTOCOL_FEE",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "FLASHLOAN_PREMIUM_TOTAL",
      "outputs": [
          {
              "internalType": "uint128",
              "name": "",
              "type": "uint128"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "FLASHLOAN_PREMIUM_TO_PROTOCOL",
      "outputs": [
          {
              "internalType": "uint128",
              "name": "",
              "type": "uint128"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "MAX_NUMBER_RESERVES",
      "outputs": [
          {
              "internalType": "uint16",
              "name": "",
              "type": "uint16"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "MAX_STABLE_RATE_BORROW_SIZE_PERCENT",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "POOL_REVISION",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "fee",
              "type": "uint256"
          }
      ],
      "name": "backUnbacked",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "interestRateMode",
              "type": "uint256"
          },
          {
              "internalType": "uint16",
              "name": "referralCode",
              "type": "uint16"
          },
          {
              "internalType": "address",
              "name": "onBehalfOf",
              "type": "address"
          }
      ],
      "name": "borrow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint8",
              "name": "id",
              "type": "uint8"
          },
          {
              "components": [
                  {
                      "internalType": "uint16",
                      "name": "ltv",
                      "type": "uint16"
                  },
                  {
                      "internalType": "uint16",
                      "name": "liquidationThreshold",
                      "type": "uint16"
                  },
                  {
                      "internalType": "uint16",
                      "name": "liquidationBonus",
                      "type": "uint16"
                  },
                  {
                      "internalType": "address",
                      "name": "priceSource",
                      "type": "address"
                  },
                  {
                      "internalType": "string",
                      "name": "label",
                      "type": "string"
                  }
              ],
              "internalType": "struct DataTypes.EModeCategory",
              "name": "category",
              "type": "tuple"
          }
      ],
      "name": "configureEModeCategory",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "onBehalfOf",
              "type": "address"
          },
          {
              "internalType": "uint16",
              "name": "referralCode",
              "type": "uint16"
          }
      ],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          }
      ],
      "name": "dropReserve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "from",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "balanceFromBefore",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "balanceToBefore",
              "type": "uint256"
          }
      ],
      "name": "finalizeTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "receiverAddress",
              "type": "address"
          },
          {
              "internalType": "address[]",
              "name": "assets",
              "type": "address[]"
          },
          {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
          },
          {
              "internalType": "uint256[]",
              "name": "interestRateModes",
              "type": "uint256[]"
          },
          {
              "internalType": "address",
              "name": "onBehalfOf",
              "type": "address"
          },
          {
              "internalType": "bytes",
              "name": "params",
              "type": "bytes"
          },
          {
              "internalType": "uint16",
              "name": "referralCode",
              "type": "uint16"
          }
      ],
      "name": "flashLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "receiverAddress",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "internalType": "bytes",
              "name": "params",
              "type": "bytes"
          },
          {
              "internalType": "uint16",
              "name": "referralCode",
              "type": "uint16"
          }
      ],
      "name": "flashLoanSimple",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          }
      ],
      "name": "getConfiguration",
      "outputs": [
          {
              "components": [
                  {
                      "internalType": "uint256",
                      "name": "data",
                      "type": "uint256"
                  }
              ],
              "internalType": "struct DataTypes.ReserveConfigurationMap",
              "name": "",
              "type": "tuple"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint8",
              "name": "id",
              "type": "uint8"
          }
      ],
      "name": "getEModeCategoryData",
      "outputs": [
          {
              "components": [
                  {
                      "internalType": "uint16",
                      "name": "ltv",
                      "type": "uint16"
                  },
                  {
                      "internalType": "uint16",
                      "name": "liquidationThreshold",
                      "type": "uint16"
                  },
                  {
                      "internalType": "uint16",
                      "name": "liquidationBonus",
                      "type": "uint16"
                  },
                  {
                      "internalType": "address",
                      "name": "priceSource",
                      "type": "address"
                  },
                  {
                      "internalType": "string",
                      "name": "label",
                      "type": "string"
                  }
              ],
              "internalType": "struct DataTypes.EModeCategory",
              "name": "",
              "type": "tuple"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint16",
              "name": "id",
              "type": "uint16"
          }
      ],
      "name": "getReserveAddressById",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          }
      ],
      "name": "getReserveData",
      "outputs": [
          {
              "components": [
                  {
                      "components": [
                          {
                              "internalType": "uint256",
                              "name": "data",
                              "type": "uint256"
                          }
                      ],
                      "internalType": "struct DataTypes.ReserveConfigurationMap",
                      "name": "configuration",
                      "type": "tuple"
                  },
                  {
                      "internalType": "uint128",
                      "name": "liquidityIndex",
                      "type": "uint128"
                  },
                  {
                      "internalType": "uint128",
                      "name": "currentLiquidityRate",
                      "type": "uint128"
                  },
                  {
                      "internalType": "uint128",
                      "name": "variableBorrowIndex",
                      "type": "uint128"
                  },
                  {
                      "internalType": "uint128",
                      "name": "currentVariableBorrowRate",
                      "type": "uint128"
                  },
                  {
                      "internalType": "uint128",
                      "name": "currentStableBorrowRate",
                      "type": "uint128"
                  },
                  {
                      "internalType": "uint40",
                      "name": "lastUpdateTimestamp",
                      "type": "uint40"
                  },
                  {
                      "internalType": "uint16",
                      "name": "id",
                      "type": "uint16"
                  },
                  {
                      "internalType": "address",
                      "name": "aTokenAddress",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "stableDebtTokenAddress",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "variableDebtTokenAddress",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "interestRateStrategyAddress",
                      "type": "address"
                  },
                  {
                      "internalType": "uint128",
                      "name": "accruedToTreasury",
                      "type": "uint128"
                  },
                  {
                      "internalType": "uint128",
                      "name": "unbacked",
                      "type": "uint128"
                  },
                  {
                      "internalType": "uint128",
                      "name": "isolationModeTotalDebt",
                      "type": "uint128"
                  }
              ],
              "internalType": "struct DataTypes.ReserveData",
              "name": "",
              "type": "tuple"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          }
      ],
      "name": "getReserveNormalizedIncome",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          }
      ],
      "name": "getReserveNormalizedVariableDebt",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "getReservesList",
      "outputs": [
          {
              "internalType": "address[]",
              "name": "",
              "type": "address[]"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "user",
              "type": "address"
          }
      ],
      "name": "getUserAccountData",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "totalCollateralBase",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "totalDebtBase",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "availableBorrowsBase",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "currentLiquidationThreshold",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "ltv",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "healthFactor",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "user",
              "type": "address"
          }
      ],
      "name": "getUserConfiguration",
      "outputs": [
          {
              "components": [
                  {
                      "internalType": "uint256",
                      "name": "data",
                      "type": "uint256"
                  }
              ],
              "internalType": "struct DataTypes.UserConfigurationMap",
              "name": "",
              "type": "tuple"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "user",
              "type": "address"
          }
      ],
      "name": "getUserEMode",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "aTokenAddress",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "stableDebtAddress",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "variableDebtAddress",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "interestRateStrategyAddress",
              "type": "address"
          }
      ],
      "name": "initReserve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "contract IPoolAddressesProvider",
              "name": "provider",
              "type": "address"
          }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "collateralAsset",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "debtAsset",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "user",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "debtToCover",
              "type": "uint256"
          },
          {
              "internalType": "bool",
              "name": "receiveAToken",
              "type": "bool"
          }
      ],
      "name": "liquidationCall",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address[]",
              "name": "assets",
              "type": "address[]"
          }
      ],
      "name": "mintToTreasury",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "onBehalfOf",
              "type": "address"
          },
          {
              "internalType": "uint16",
              "name": "referralCode",
              "type": "uint16"
          }
      ],
      "name": "mintUnbacked",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "user",
              "type": "address"
          }
      ],
      "name": "rebalanceStableBorrowRate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "interestRateMode",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "onBehalfOf",
              "type": "address"
          }
      ],
      "name": "repay",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "interestRateMode",
              "type": "uint256"
          }
      ],
      "name": "repayWithATokens",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "interestRateMode",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "onBehalfOf",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          },
          {
              "internalType": "uint8",
              "name": "permitV",
              "type": "uint8"
          },
          {
              "internalType": "bytes32",
              "name": "permitR",
              "type": "bytes32"
          },
          {
              "internalType": "bytes32",
              "name": "permitS",
              "type": "bytes32"
          }
      ],
      "name": "repayWithPermit",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "token",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          }
      ],
      "name": "rescueTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          }
      ],
      "name": "resetIsolationModeTotalDebt",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "components": [
                  {
                      "internalType": "uint256",
                      "name": "data",
                      "type": "uint256"
                  }
              ],
              "internalType": "struct DataTypes.ReserveConfigurationMap",
              "name": "configuration",
              "type": "tuple"
          }
      ],
      "name": "setConfiguration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "rateStrategyAddress",
              "type": "address"
          }
      ],
      "name": "setReserveInterestRateStrategyAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint8",
              "name": "categoryId",
              "type": "uint8"
          }
      ],
      "name": "setUserEMode",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "bool",
              "name": "useAsCollateral",
              "type": "bool"
          }
      ],
      "name": "setUserUseReserveAsCollateral",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "onBehalfOf",
              "type": "address"
          },
          {
              "internalType": "uint16",
              "name": "referralCode",
              "type": "uint16"
          }
      ],
      "name": "supply",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "onBehalfOf",
              "type": "address"
          },
          {
              "internalType": "uint16",
              "name": "referralCode",
              "type": "uint16"
          },
          {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
          },
          {
              "internalType": "uint8",
              "name": "permitV",
              "type": "uint8"
          },
          {
              "internalType": "bytes32",
              "name": "permitR",
              "type": "bytes32"
          },
          {
              "internalType": "bytes32",
              "name": "permitS",
              "type": "bytes32"
          }
      ],
      "name": "supplyWithPermit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "interestRateMode",
              "type": "uint256"
          }
      ],
      "name": "swapBorrowRateMode",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "protocolFee",
              "type": "uint256"
          }
      ],
      "name": "updateBridgeProtocolFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint128",
              "name": "flashLoanPremiumTotal",
              "type": "uint128"
          },
          {
              "internalType": "uint128",
              "name": "flashLoanPremiumToProtocol",
              "type": "uint128"
          }
      ],
      "name": "updateFlashloanPremiums",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "asset",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          },
          {
              "internalType": "address",
              "name": "to",
              "type": "address"
          }
      ],
      "name": "withdraw",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  }
];

const wethAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"; //Goerli

const doDeploy = false;
const factoryAddress = "0xA556719b7b297a7ba14ebC539Ad5360587858669";

// Example NFT contract and TBA
var nftAddress = "0x3f74F59fcD89c08CB0a29a08042ccd84E26F624D";
var tbaAddress = "0x4b96C46cdBC95c1Da18Bb0cCa9Ec8F37B4D61EB0"; // for tokenId 0

// Compound:
const compoundWethAddress = "0x42a71137C09AE83D8d05974960fd607d40033499"; // Goerli
const compoundUsdcAddress = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"; // Goerli
const cWETHv3 = "0x9A539EEc489AAA03D588212a164d0abdB5F08F5F"; // Goerli: cWETHv3
const cUSDCv3 = "0x3EE77595A8459e93C2888b13aDB354017B198188"; // Goerli: cUSDCv3

// Aave:
const aavePool = "0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6"; // Goerli
const aaveUSDC = "0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43"; // Aave Test USDC
const aUSDC = "0x1Ee669290939f8a8864497Af3BC83728715265FF"; // Aave Supply USDC
const dUSDC = "0x4DAe67e69aCed5ca8f99018246e6476F82eBF9ab"; // Aave Debt Token
const aaveDAI = "0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464"; // Aave Test DAI
const aDAI = "0x310839bE20Fc6a8A89f33A59C7D5fC651365068f"; // Aave Supply DAI
const dDAI = "0xEa5A7CB3BDF6b2A8541bd50aFF270453F1505A72"; // Aave Debt DAI

const myContractAbi = [
  'function supply(address asset, uint amount) public',
  'function withdraw(address asset, uint amount) public',
];

const cometAbi = [
  'event Supply(address indexed from, address indexed dst, uint256 amount)',
  'function supply(address asset, uint amount)',
  'function withdraw(address asset, uint amount)',
  'function balanceOf(address account) returns (uint256)',
  'function borrowBalanceOf(address account) returns (uint256)',
  'function collateralBalanceOf(address account, address asset) external view returns (uint128)',
];

describe("Contracts", function () {
  // We define a fixture to reuse the same setup in every test.

  let factory: FinanceNFTFactory;
  let implementation: FinanceNFT;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const financeNFTFactoryFactory = await ethers.getContractFactory("FinanceNFTFactory");
    if (doDeploy) {
      // nft implementation
      const financeNFTFactory = await ethers.getContractFactory("FinanceNFT");
      implementation = (await financeNFTFactory.deploy()) as FinanceNFT;
      await implementation.deployed();
      // nft factory
      factory = (await financeNFTFactoryFactory.deploy()) as FinanceNFTFactory;
      await factory.deployed();
      await factory.initialize(implementation.address);
    } else {
      // use previously deployed factory
      factory = new ethers.Contract(factoryAddress, financeNFTFactoryFactory.interface, owner) as FinanceNFTFactory;
    }
  });

  describe("Deployment", function () {
    it.skip("Should have the right implementation", async function () {
      if (doDeploy) {
        expect(await factory.nftImplementation()).to.equal(implementation.address);
      } else {
        expect(true);
      }
    });

    var nft: FinanceNFT;

    it.skip("Should deploy a new NFT contract for a company", async function () {
      const name = "Company A";
      const symbol = "AAA";
      const uri = "ipfs:/testing"; // this is the metadata uri for tokenId 0 -- the master NFT
      const [owner] = await ethers.getSigners();
      const contractOwner = owner.address;

      if (doDeploy) {
        const deployResult = await factory.createFinanceNFT(name, symbol, contractOwner, uri);
        const { events } = await deployResult.wait();
        const event = events.find(x => x.event === "FinanceNFTCreated");
        nftAddress = event.args[1];
      }
      //console.log("nftAddress", nftAddress);
      expect(nftAddress).to.not.be.null;
    });

    it.skip("Should mint a new NFT token", async function () {
      const uri = "ipfs:/token1"; // this is the metadata uri for tokenId 1
      const [owner] = await ethers.getSigners();
      nft = new ethers.Contract(nftAddress, implementation.interface, owner) as FinanceNFT;
      const tokenOwner = owner.address;
      await expect(nft.mint(tokenOwner, uri))
        .to.emit(nft, 'Transfer')
        .withArgs("0x0000000000000000000000000000000000000000", tokenOwner, 1);
    });

    it.skip("Should deploy TBA contract for an NFT tokenId 0", async function () {
      this.timeout(2400000);
      const [owner] = await ethers.getSigners();
      const registry = new ethers.Contract(registryAddress, registryABI, owner);
      const tokenboundClient = new TokenboundClient({ signer: owner, chainId: 5 });
      const predictedAccount = await tokenboundClient.getAccount({
        tokenContract: nftAddress,
        tokenId: "0",
      });
      console.log(predictedAccount);
      
      await expect(registry.createAccount(tbaImplementationAddress, 5, nftAddress, 0, 0, ethers.utils.formatBytes32String("0x8129xc1c"), {gasLimit: 2000000}))
        .to.emit(registry, 'AccountCreated')
        .withArgs(predictedAccount, tbaImplementationAddress, 5, nftAddress, 0, 0);
    });

    it.skip("Should send ETH to TBA", async function () {
      const [owner] = await ethers.getSigners();
      const balBefore = await ethers.provider.getBalance(tbaAddress);
      const tx = await owner.sendTransaction({
        to: tbaAddress,
        value: ethers.utils.parseEther("0.01")
      });
      tx.wait();
      const balAfter = await ethers.provider.getBalance(tbaAddress);
      expect(balAfter > balBefore);
    });

    it("Should send WETH to TBA", async function () {
      const [owner] = await ethers.getSigners();
      const weth = new ethers.Contract(wethAddress, tokenABI, owner);
      const balBefore = await weth.balanceOf(tbaAddress);
      const tx = await weth.transfer(tbaAddress, "1000");
      await tx.wait();
      const balAfter = await weth.balanceOf(tbaAddress);
      expect(balAfter > balBefore);
    });
    
    it.skip("Should send Compound WETH to TBA", async function () {
      const [owner] = await ethers.getSigners();
      const weth = new ethers.Contract(compoundWethAddress, tokenABI, owner);
      const balBefore = await weth.balanceOf(tbaAddress);
      const tx = await weth.transfer(tbaAddress, ethers.utils.parseUnits("0.2"));
      await tx.wait(1);
      const balAfter = await weth.balanceOf(tbaAddress);
      expect(balAfter > balBefore);
    });

    it.skip("Should transfer WETH from TBA to owner", async function () {
      const [owner] = await ethers.getSigners();
      const weth = new ethers.Contract(wethAddress, tokenABI, owner);
      const balBefore = await weth.balanceOf(owner.address);
      let iface = new ethers.utils.Interface(["function transfer(address to, uint256 amount)"]);
      const txnData = iface.encodeFunctionData("transfer", [owner.address, "1000"]);
      const tba = new ethers.Contract(tbaAddress, accountABI, owner);
      var txn = await tba.executeCall(wethAddress, 0, txnData, {gasLimit: 2000000});
      await txn.wait(1);
      const balAfter = await weth.balanceOf(owner.address);
      expect(balAfter > balBefore);
    });

    it.skip("Should supply WETH to Compound III to earn yield", async function () {
      this.timeout(2400000);
      const [owner] = await ethers.getSigners();
      const weth = new ethers.Contract(compoundWethAddress, tokenABI, owner);
      const comet = new ethers.Contract(cWETHv3, cometAbi, owner);
      const wethMantissa = 1e18; // WETH and ETH have 18 decimal places
      const amt = ethers.utils.parseUnits("0.2");
      const tba = new ethers.Contract(tbaAddress, accountABI, owner);
      // approve:
      let wethInterface = new ethers.utils.Interface(tokenABI);
      const approveData = wethInterface.encodeFunctionData("approve", [cWETHv3, amt]);
      var approve = await tba.executeCall(compoundWethAddress, 0, approveData, {gasLimit: 2000000});
      await approve.wait(1);
      // supply:
      let comentInterface = new ethers.utils.Interface(cometAbi);
      const supplyData = comentInterface.encodeFunctionData("supply", [compoundWethAddress, amt]);
      var supply = await tba.executeCall(cWETHv3, 0, supplyData, {gasLimit: 2000000});
      await supply.wait(1);
      expect(true); // TODO: fix this
    });

    it.skip("Should supply WETH as collateral to borrow USDC from Compound III", async function () {
      this.timeout(2400000);
      const [owner] = await ethers.getSigners();
      const usdc = new ethers.Contract(compoundUsdcAddress, tokenABI, owner);
      const comet = new ethers.Contract(cUSDCv3, cometAbi, owner);
      const wethMantissa = 1e18; // WETH and ETH have 18 decimal places
      const usdcMantissa = 1e6; // USDC has 6 decimal places
      const wethAmt = ethers.utils.parseUnits("0.2");
      const usdcAmt = 100; // 100 USDC (minimum borrow)
      const tba = new ethers.Contract(tbaAddress, accountABI, owner);
      // approve:
      let wethInterface = new ethers.utils.Interface(tokenABI);
      const approveData = wethInterface.encodeFunctionData("approve", [cUSDCv3, wethAmt]);
      var approve = await tba.executeCall(compoundWethAddress, 0, approveData, {gasLimit: 2000000});
      await approve.wait(1);
      // supply:
      let comentInterface = new ethers.utils.Interface(cometAbi);
      const supplyData = comentInterface.encodeFunctionData("supply", [compoundWethAddress, wethAmt]);
      var supply = await tba.executeCall(cUSDCv3, 0, supplyData, {gasLimit: 2000000});
      await supply.wait(1);
      // borrow:
      const borrowData = comentInterface.encodeFunctionData("withdraw", [compoundUsdcAddress, (usdcAmt * usdcMantissa).toString()]);
      var borrow = await tba.executeCall(cUSDCv3, 0, borrowData, {gasLimit: 2000000});
      await borrow.wait(1);
      expect(true); // TODO: fix this
    });

    it.skip("Should send Aave USDC to TBA", async function () {
      const [owner] = await ethers.getSigners();
      const usdc = new ethers.Contract(aaveUSDC, tokenABI, owner);
      const balBefore = await usdc.balanceOf(tbaAddress);
      const tx = await usdc.transfer(tbaAddress, "100000000"); // 100 USD (6 decimals for USDC));
      await tx.wait(1);
      const balAfter = await usdc.balanceOf(tbaAddress);
      expect(balAfter > balBefore);
    });

    it.skip("Should supply USDC to Aave v3 to earn yield", async function () {
      const [owner] = await ethers.getSigners();
      const usdc = new ethers.Contract(aaveUSDC, tokenABI, owner);
      const aUSDContract = new ethers.Contract(aUSDC, tokenABI, owner);
      const balBefore = await aUSDContract.balanceOf(tbaAddress);
      const tba = new ethers.Contract(tbaAddress, accountABI, owner);
      // approve:
      let usdcInterface = new ethers.utils.Interface(tokenABI);
      const approveData = usdcInterface.encodeFunctionData("approve", [aavePool, "100000000"]);
      var approve = await tba.executeCall(aaveUSDC, 0, approveData, {gasLimit: 2000000});
      await approve.wait(1);
      // supply:
      let poolInterface = new ethers.utils.Interface(poolABI);
      const supplyData = poolInterface.encodeFunctionData("supply", [aaveUSDC, "100000000", tbaAddress, 0]);
      var supply = await tba.executeCall(aavePool, 0, supplyData, {gasLimit: 2000000});
      await supply.wait(1);
      const balAfter = await aUSDContract.balanceOf(tbaAddress);
      expect(balAfter > balBefore);
    });

    it.skip("Should borrow DAI from Aave v3", async function () {
      const [owner] = await ethers.getSigners();
      const dai = new ethers.Contract(aaveDAI, tokenABI, owner);
      const dDAIContract = new ethers.Contract(aUSDC, tokenABI, owner);
      const balBefore = await dDAIContract.balanceOf(tbaAddress);
      const tba = new ethers.Contract(tbaAddress, accountABI, owner);
      // borrow:
      let poolInterface = new ethers.utils.Interface(poolABI);
      const borrowData = poolInterface.encodeFunctionData("borrow", [aaveDAI, "25000000000000000000", 2, 0, tbaAddress]);   // 25 DAI with 18 decimals
      var borrow = await tba.executeCall(aavePool, 0, borrowData, {gasLimit: 2000000});
      await borrow.wait(1);
      const balAfter = await dDAIContract.balanceOf(tbaAddress);
      expect(balAfter > balBefore);
    });

    it("Should add a joint account holder to TBA", async function () {
      const [owner] = await ethers.getSigners();
      const tba = new ethers.Contract(tbaAddress, accountABI, owner);
      const callers = [process.env.RECOVERY_ADDR];
      const permissions = [true];
      await expect(tba.setPermissions(callers, permissions, {gasLimit: 2000000}))
        .to.emit(tba, 'PermissionUpdated');
    });

    it("Should transfer WETH from TBA to Social Recovery Address", async function () {
      const [owner, recovery] = await ethers.getSigners();
      const weth = new ethers.Contract(wethAddress, tokenABI, recovery);
      const balBefore = await weth.balanceOf(recovery.address);
      let iface = new ethers.utils.Interface(["function transfer(address to, uint256 amount)"]);
      const txnData = iface.encodeFunctionData("transfer", [recovery.address, "1000"]);
      const tba = new ethers.Contract(tbaAddress, accountABI, recovery);
      var txn = await tba.executeCall(wethAddress, 0, txnData, {gasLimit: 2000000});
      await txn.wait(1);
      const balAfter = await weth.balanceOf(recovery.address);
      expect(balAfter > balBefore);
    });


  });

  
});
