const TheMuseum = artifacts.require("TheMuseum");
const UserManager = artifacts.require("UserManager");
const DeMuse = artifacts.require("DeMuse");
const truffleAssert = require("truffle-assertions");

contract( "Reverse the adoption", async accounts => { 
    let admin =accounts[0];
    let registeredUser = accounts[1];
    let unRegisteredUser = accounts[2];

    
    it ("Museum reverses the painting", async()=>{

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

    let revertAdoptionTx = await museum.reverseAdoption(pID,{from: admin});

    let reversedOwner = await deMuse.ownerOf(pID);
    assert.equal(reversedOwner,museum.address,"Reverse adoption to museum failed");


    });

});