const TheMuseum = artifacts.require("TheMuseum");
const UserManager = artifacts.require("UserManager");
const DeMuse = artifacts.require("DeMuse");
const truffleAssert = require("truffle-assertions");

contract( "Painting adoption approval", async accounts=>{
    let admin =accounts[0];
    let registeredUser = accounts[1];
    let unRegisteredUser = accounts[2];

    
    it ("Registered user adoptions a painting", async()=>{

        let museum = await TheMuseum.deployed();
        let userManager = await UserManager.deployed();
        let deMuse = await DeMuse.deployed();

    //add painting to deMuse
    let pID = 123456789;
    let tx = await museum.newPaintingForAdoption("Sun Flower",pID,45,{from: admin});

    // truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
    //     return ev.to === museum.address && ev.tokenId==pID;
    // });

    truffleAssert.eventEmitted(tx, 'AdoptionPaintingAdded', (ev) => {
        return ev.owner === museum.address && ev.paintingID==pID;
    });

    //register an user - User_1
    let user_1 = "User_1"
    let UserTx = await userManager.addUser(user_1,{from: registeredUser});
    truffleAssert.eventEmitted(UserTx, 'UserAdded', (ev) => {
        return ev.user === registeredUser && ev.userName==user_1;
    });

    //Registered User adopts the SunFlower painting
    let approvedTx = await museum.adoptionApproval(pID,{from: registeredUser, value:60});
    // truffleAssert.eventEmitted(approvedTx, 'Approval', (ev) => {
    //     return ev.owner === museum.address && ev.approved===registeredUser && ev.tokenId===pID;
    // });

    let approvedUser = await deMuse.getApproved(pID);
    assert.equal(registeredUser,approvedUser,"The registered User did not get approval");

    let adoptedTx = await deMuse.adoptAndApproveMuseum(pID,{from: registeredUser});
    // truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
    //     return ev.to === registeredUser && ev.tokenId==pID;
    // });
    // truffleAssert.eventEmitted(approvedTx, 'Approval', (ev) => {
    //     return ev.owner === registeredUser && ev.approved===museum.address && ev.tokenId===pID;
    // });

    let newOwner = await deMuse.ownerOf(pID);
    assert.equal(newOwner,registeredUser,"Transfer to registeretedUser failed");

    let newApprovedUser = await deMuse.getApproved(pID);
    assert.equal(museum.address,newApprovedUser,"The Museum did not get approval");

    });

    it ("Unregisterd User cannot be approved for adoption", async()=>{

    let museum = await TheMuseum.deployed();
    let userManager = await UserManager.deployed();
    let deMuse = await DeMuse.deployed();

    //add painting to deMuse
    let pID = 987654321;
    let tx = await museum.newPaintingForAdoption("Hay Stack",pID,45,{from: admin});

    // truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
    //     return ev.to === admin && ev.tokenId==pID;
    // });

    truffleAssert.eventEmitted(tx, 'AdoptionPaintingAdded', (ev) => {
        return ev.owner === museum.address && ev.paintingID==pID;
    });

    try{
        let approvedTx = await museum.adoptionApproval(pID,{from: unRegisteredUser, value: 60});
        assert.fail("Revert: Other users cannot add the painting")  
      }catch(err){
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }

    let approvedUser = await deMuse.getApproved(pID);
    assert.notEqual(registeredUser,approvedUser,"Approval should not be done");
   
    });

    it ("Registered user fails trying to adopt a already adopted painting", async()=>{

    let museum = await TheMuseum.deployed();
    let userManager = await UserManager.deployed();
    let deMuse = await DeMuse.deployed();

    //Registered User tries to adopt the already adopted sunflower painting
    let pID = 123456789;
    
    try{
        let approvedTx = await museum.adoptionApproval(pID,{from: registeredUser, value: 60});
        assert.fail("Revert: The registered user adopted an already adopted painintg")  
      }catch(err){
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }

    });

    it ("Registered user fails to adoption with a less value", async()=>{

      let museum = await TheMuseum.deployed();
      let userManager = await UserManager.deployed();
      let deMuse = await DeMuse.deployed();
  
      //Registered User tries to adopt Haystack painting with lesser value
      let pID = 987654321;
      
      try{
          let approvedTx = await museum.adoptionApproval(pID,{from: registeredUser, value: 30});
          assert.fail("Revert: The registered user adopted an already adopted painintg")  
        }catch(err){
          assert.include(err.message, "revert", "The error message should contain 'revert'");
        }
  
      });
});