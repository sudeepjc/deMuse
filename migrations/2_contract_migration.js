const UserManager = artifacts.require("UserManager");
const DeMuse = artifacts.require("DeMuse");
const TheMuseum = artifacts.require("TheMuseum");

module.exports = function(deployer) {
  deployer.then(async () => {
  
    const umInstance = await deployer.deploy(UserManager);
    console.log('UserManager contract deployed at', umInstance.address);

    const deMuse = await deployer.deploy(DeMuse, umInstance.address);
    console.log('DeMuse contract deployed at', deMuse.address);

  })
};