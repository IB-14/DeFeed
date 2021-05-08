const Supply = artifacts.require("Supply");
//move smart contracts from computer to blockchain
module.exports = function(deployer) {
  // Code goes here...
  deployer.deploy(Supply);
};