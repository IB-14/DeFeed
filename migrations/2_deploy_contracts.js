// var SimpleStorage = artifacts.require("./SimpleStorage.sol");
const DeFeed= artifacts.require("./DeFeed.sol");


module.exports = function(deployer) {
  // deployer.deploy(SimpleStorage);
  deployer.deploy(DeFeed);
};
