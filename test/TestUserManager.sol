pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/UserManager.sol";

contract TestUserManager {

  // UserManager um;

  // function beforeAll() public{

  //   um = UserManager(DeployedAddresses.UserManager());

  // }

  function testForAdminUser() public {

    UserManager um = UserManager(DeployedAddresses.UserManager());

    uint8 expectedRole = uint8(UserManager.UserRole.Admin);
    string memory expectedName = "admin";

    (string memory actualName, uint8 actualRole) = um.getUserInfo(tx.origin);

    Assert.equal(uint(actualRole),uint(expectedRole), "Expected role admin");
    Assert.equal(actualName,expectedName, "Expected name Admin");
  }
}
