const TheMuseum = artifacts.require("TheMuseum");
const UserManager = artifacts.require("UserManager");
const truffleAssert = require("truffle-assertions");

contract( "Museum Listing", async accounts=>{
    let admin =accounts[0];
    let registeredUser = accounts[1];

    it ("See the listing of the adopted painting", async()=>{

    let museum = await TheMuseum.deployed();
    let userManager = await UserManager.deployed();

    //add painting to deMuse
    let pID = 123456789;
    let tx = await museum.newPaintingForAdoption("Sun Flower",pID,45,{from: admin});

    // truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
    //     return ev.to === museum.address && ev.tokenId==pID;
    // });

    truffleAssert.eventEmitted(tx, 'AdoptionPaintingAdded', (ev) => {
        return ev.owner === museum.address && ev.paintingID==pID;
    });

    //Get current adopter for the added painting
    let adoptedBy = await museum.getAdoptedBy(pID);
    assert.equal("Museum",adoptedBy,"The current adopter is not Museum");
    
    });
});