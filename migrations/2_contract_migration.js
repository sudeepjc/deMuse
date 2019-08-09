const UserManager = artifacts.require("UserManager");

module.exports = function(deployer) {
  deployer.deploy(UserManager);
};