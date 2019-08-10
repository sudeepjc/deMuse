pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DeMuse.sol";
import "../contracts/UserManager.sol";

contract TestDeMuse {


  function testForDeployment() public {
    // UserManager um = UserManager(DeployedAddresses.UserManager());
    // DeMuse deMuse = new DeMuse(address(um));
    DeMuse deMuse = DeMuse(DeployedAddresses.DeMuse());

    Assert.equal(deMuse.name(),"DeMuse", "Expected name DeMuse");
    Assert.equal(deMuse.symbol(),"DEM", "Expected symbol DEM");
  }

  // function testAddPainting() public {
  //   DeMuse deMuse = DeMuse(DeployedAddresses.DeMuse());
  //   uint pID = deMuse.addPainting("vangough",123456,12,0);

  //   Assert.equal(pID,123456,"painting ID mismatch");

  //   (string memory pName,uint256 paintingID, uint128 adptTC,uint128 aucTC) = deMuse.paintings(0);

  //   Assert.equal(paintingID,pID,"painting ID mismatch");
  //   Assert.equal(pName,"vangough","painting name mismatch");
  //   Assert.equal(uint(adptTC),12,"painting adoption token count mismatch");
  //   Assert.equal(uint(aucTC),0,"painting adoption token count mismatch");
  // }
}
