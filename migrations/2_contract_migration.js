const UserManager = artifacts.require("UserManager");
const DeMuse = artifacts.require("DeMuse");
const TheMuseum = artifacts.require("TheMuseum");

module.exports = function(deployer) {
  deployer.then(async () => {
  
    const umInstance = await deployer.deploy(UserManager);
    console.log('UserManager contract deployed at', umInstance.address);

    const deMuse = await deployer.deploy(DeMuse);
    console.log('DeMuse contract deployed at', deMuse.address);

    const museum = await deployer.deploy(TheMuseum, deMuse.address, umInstance.address);
    console.log('TheMuseum contract deployed at', museum.address);

    await deMuse.addMinter(museum.address);
    await deMuse.setMuseumAddress(museum.address);
    await umInstance.addDeMuse(museum.address);

  })
};