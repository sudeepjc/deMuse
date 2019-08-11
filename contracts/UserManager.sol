pragma solidity ^0.5.10;

/**
    User Manager for registering/de-registering a user from the system
    @title : UserManagement contract for the DeMuse
*/
contract UserManager{

    address private admin;

    enum UserRole { Unregistered, Registerted, Admin}

    struct UserInfo{
        string name;
        uint8 role;
    }

    mapping (address => UserInfo) users;

    event UserAdded(address indexed user, string userName);

    constructor() public {
        require(msg.sender != address(0),"Invalid address");
        admin = msg.sender;
        users[admin] = UserInfo({ name: 'admin', role : uint8(UserRole.Admin)});
    }

    modifier onlyAdmin() {
        require(msg.sender == admin,"Only Admin allowed to perform operation");
        _;
    }

    function getUserInfo(address userAddress) public view returns (string memory ,uint8){
        UserInfo memory user = users[userAddress];
        return (user.name, user.role);
    }

    function addUser(string memory name) public payable {
        require(msg.sender != address(0),"Invalid address sent");
        require(msg.sender != admin,"Admin cannot be a registered user");
        users[msg.sender] = UserInfo({ name: name, role : uint8(UserRole.Registerted)});
        emit UserAdded(msg.sender,name);
    }

    function addDeMuse(address museumContract) public onlyAdmin payable{
        users[museumContract] = UserInfo({ name: "Museum", role : uint8(UserRole.Registerted)});
        emit UserAdded(museumContract,"Museum");
    }

    function getAdmin() public view returns(address){
        return admin;
    }

    function isRegisteredUser(address userAddress) public view returns (bool){
        UserInfo memory user = users[userAddress];

        if(user.role == uint8(UserRole.Registerted)){
            return true;
        }else{
            return false;
        }
    }
}