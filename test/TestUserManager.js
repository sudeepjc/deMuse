const UserManager = artifacts.require("UserManager");

contract("User Manager Test", async accounts => {

  let admin = accounts[0];
  let registeredUser = accounts[1];

  it("UserManager contract is deployed", async () => {
    let umInstance = await UserManager.deployed();

    let response = await umInstance.getUserInfo.call(admin);

    assert.equal(response[0],"admin","name mismatch");
    assert.equal(response[1], 1 ,"Role mismatch")
  });

  it("Anbody can register as a user", async () => {
    let umInstance = await UserManager.deployed();

    await umInstance.addUser("User_1",{from: registeredUser});

    let response = await umInstance.getUserInfo.call(registeredUser);

    assert.equal(response[0],"User_1","name mismatch");
    assert.equal(response[1], 0 ,"Role mismatch")
  });

  it("Admin cannot be a registered user", async () => {
    let umInstance = await UserManager.deployed();

    try{
      await umInstance.addUser("admin",{from: admin});
      assert.fail("Revert: Admin cannot be a registered user- exception was expected")  
    }catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

  });

});