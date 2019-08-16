const UserManager = artifacts.require("UserManager");
const truffleAssert = require("truffle-assertions");

contract("User Manager Test", async accounts => {

  let admin = accounts[0];
  let registeredUser = accounts[1];
  let unRegisteredUser = accounts[2];

  it("UserManager contract is deployed", async () => {
    let umInstance = await UserManager.deployed();

    let response = await umInstance.getUserInfo.call(admin);

    assert.equal(response[0],"admin","name mismatch");
    assert.equal(response[1], 2 ,"Role mismatch")
  });

  it("Anbody can register as a user", async () => {
    let umInstance = await UserManager.deployed();
    let user_1 = "User_1";

    let tx = await umInstance.addUser("User_1",{from: registeredUser});

    truffleAssert.eventEmitted(tx, 'UserAdded', (ev) => {
      return ev.user === registeredUser && ev.userName==user_1;
    });

    let response = await umInstance.getUserInfo(registeredUser);

    assert.equal(response[0],"User_1","name mismatch");
    assert.equal(response[1], 1 ,"Role mismatch");
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

  it("Registered User cannot register again", async () => {
    let umInstance = await UserManager.deployed();

    try{
      await umInstance.addUser("admin",{from: registeredUser});
      assert.fail("Revert: Registered User cannot register again- exception was expected")  
    }catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

  });

  it("Test if user is registered or not", async () =>{
    let umInstance = await UserManager.deployed();

    let status = await umInstance.isRegisteredUser(registeredUser);
    assert.isTrue(status,"Registered User turned out be not registered");

    status = await umInstance.isRegisteredUser(unRegisteredUser);
    assert.isFalse(status,"Unregistered User turned out be registered");

  })

});