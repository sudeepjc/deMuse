const DeMuse = artifacts.require("DeMuse");
const truffleAssert = require("truffle-assertions");

contract("DeMuse Test", async accounts => {

  let admin = accounts[0];
  let otherUser = accounts[1];

  it("DeMuse contract is deployed", async () => {
    let deMuse = await DeMuse.deployed();
    let name = await deMuse.name();
    let symbol = await deMuse.symbol();

    assert.equal("DeMuse",name, "Expected name DeMuse");
    assert.equal("DEM",symbol, "Expected symbol DEM");
  });

  it("Admin adds the digital painting for adoption", async () => {
    let deMuse = await DeMuse.deployed();

    let pID = 123456789;

    let tx = await deMuse.newPaintingForAdoption("Sun Flower",pID,45,{from: admin});

    truffleAssert.eventEmitted(tx, 'AdoptionPaintingAdded', (ev) => {
        return ev.owner === deMuse.address && ev.paintingID==pID;
    });

    truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
        return ev.to === deMuse.address && ev.tokenId==pID;
    });

    let newAdoptionCount = await deMuse.numberOfAdoptionPaintings();
    let newAuctionCount = await deMuse.numberOfAuctionPaintings();

    assert.equal(1,newAdoptionCount, "Mismatch in the number of adoption paintings");
    assert.equal(0,newAuctionCount, "Mismatch in the number of adoption paintings");

    let paintingData = await deMuse.adoptionPaintings(0);

    assert.equal("Sun Flower",paintingData[0],"painting name mismatch");
    assert.equal(123456789,paintingData[1],"painting ID mismatch");
    assert.equal(45,paintingData[2],"painting token count mismatch");
    assert.equal(0,paintingData[3],"painting type mismatch");

  });

  it("Other users cannot add the painting", async () => {
    let deMuse = await DeMuse.deployed();

    try{
      await deMuse.newPaintingForAdoption("Sun Flower_1",1,45,{from: otherUser});
      assert.fail("Revert: Other users cannot add the painting")  
    }catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

    try{
      await deMuse.newPaintingForAuction("Sun Flower_1",1,45,{from: otherUser});
      assert.fail("Revert: Other users cannot add the painting")  
    }catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

    let newAdoptionCount = await deMuse.numberOfAdoptionPaintings();
    let newAuctionCount = await deMuse.numberOfAuctionPaintings();

    assert.equal(1,newAdoptionCount, "Mismatch in the number of adoption paintings");
    assert.equal(0,newAuctionCount, "Mismatch in the number of adoption paintings");

  });

  it("Same token/painting ID cannot be reused in either cases", async () => {
    let deMuse = await DeMuse.deployed();

    try{
      await deMuse.newPaintingForAdoption("Sun Flower",123456789,45,{from: admin});
      assert.fail("Revert: Same painting cannot be used")  
    }catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

    try{
      await deMuse.newPaintingForAuction("Sun Flower",123456789,45,{from: admin});
      assert.fail("Revert: Same painting cannot be used")  
    }catch(err){
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

    let newAdoptionCount = await deMuse.numberOfAdoptionPaintings();
    let newAuctionCount = await deMuse.numberOfAuctionPaintings();

    assert.equal(1,newAdoptionCount, "Mismatch in the number of adoption paintings");
    assert.equal(0,newAuctionCount, "Mismatch in the number of adoption paintings");

  });

  it("Admin adds another digital painting for adoption", async () => {
    let deMuse = await DeMuse.deployed();
    let pID = 987654321;

    let tx = await deMuse.newPaintingForAdoption("Haystack",pID,60,{from: admin});

    truffleAssert.eventEmitted(tx, 'AdoptionPaintingAdded', (ev) => {
        return ev.owner === deMuse.address && ev.paintingID==pID;
    });

    truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
        return ev.to === deMuse.address && ev.tokenId==pID;
    });

    let newAdoptionCount = await deMuse.numberOfAdoptionPaintings();
    let newAuctionCount = await deMuse.numberOfAuctionPaintings();

    assert.equal(2,newAdoptionCount, "Mismatch in the number of adoption paintings");
    assert.equal(0,newAuctionCount, "Mismatch in the number of adoption paintings");

    let paintingData = await deMuse.adoptionPaintings(1);

    assert.equal("Haystack",paintingData[0],"painting name mismatch");
    assert.equal(pID,paintingData[1],"painting ID mismatch");
    assert.equal(60,paintingData[2],"painting token count mismatch");
    assert.equal(0,paintingData[3],"painting type mismatch");

  });

  it("Admin adds digital painting for auction", async () => {
    let deMuse = await DeMuse.deployed();
    let pID = 7654321;

    let tx = await deMuse.newPaintingForAuction("LadyWithLamp",pID,60,{from: admin});

    truffleAssert.eventEmitted(tx, 'AuctionPaintingAdded', (ev) => {
        return ev.owner === deMuse.address && ev.paintingID==pID;
    });

    truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
        return ev.to === deMuse.address && ev.tokenId==pID;
    });

    let newAdoptionCount = await deMuse.numberOfAdoptionPaintings();
    let newAuctionCount = await deMuse.numberOfAuctionPaintings();

    assert.equal(2,newAdoptionCount, "Mismatch in the number of adoption paintings");
    assert.equal(1,newAuctionCount, "Mismatch in the number of adoption paintings");

    let paintingData = await deMuse.auctionPaintings(0);

    assert.equal("LadyWithLamp",paintingData[0],"painting name mismatch");
    assert.equal(pID,paintingData[1],"painting ID mismatch");
    assert.equal(60,paintingData[2],"painting token count mismatch");
    assert.equal(1,paintingData[3],"painting type mismatch");

  });

});