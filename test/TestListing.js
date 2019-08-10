const DeMuse = artifacts.require("DeMuse");
const UserManager = artifacts.require("UserManager");
const truffleAssert = require("truffle-assertions");

contract( "Adopted By", async accounts=>{
    let admin =accounts[0];
    let registeredUser = accounts[1];

    it ("See the listing of the adopted painting", async()=>{

    let deMuse = await DeMuse.deployed();
    let userManager = await UserManager.deployed();

    //add painting to deMuse
    let pID = 123456789;
    let tx = await deMuse.newPaintingForAdoption("Sun Flower",pID,45,{from: admin});

    truffleAssert.eventEmitted(tx, 'AdoptionPaintingAdded', (ev) => {
        return ev.owner === admin && ev.paintingID==pID;
    });

    truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
        return ev.to === admin && ev.tokenId==pID;
    });

    //register an user
    let user_1 = "User_1"
    let UserTx = await userManager.addUser(user_1,{from: registeredUser});
    truffleAssert.eventEmitted(UserTx, 'UserAdded', (ev) => {
        return ev.user === registeredUser && ev.userName==user_1;
    });

    //Get current adopter for the added painting
    let adoptedBy = await deMuse.getAdoptedBy(pID);
    assert.equal("admin",adoptedBy,"The current adopter is incorrect");
    
    });
});