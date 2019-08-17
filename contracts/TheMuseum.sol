pragma solidity ^0.5.10;

import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";

import "./UserManager.sol";
import "./DeMuse.sol";

/**
   DeMuse , a decentralized musuem for painting auctio/adoption
    @title : DeMuse contract and Token
*/
contract TheMuseum is ERC721Holder{

    address public admin;
    UserManager userMgr;
    DeMuse deMuse;

    event AdoptionPaintingAdded(address indexed owner,uint256 paintingID);
    event AuctionPaintingAdded(address indexed owner,uint256 paintingID);

    enum PaintingFor {Adoption, Auction}

    /**
     * Structurefor paintings
     */
    struct DigiPainting{
        string name;
        uint256 paintingID;
        uint128 weiValue;
        PaintingFor pType;
    }

    DigiPainting[] public adoptionPaintings;
    DigiPainting[] public auctionPaintings;

    mapping (uint256 => DigiPainting) paintings;

    constructor( address deMuseAddress, address mgrAddress) public {
        userMgr = UserManager(mgrAddress);
        admin = msg.sender;

        deMuse = DeMuse(deMuseAddress);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin,"Only Admin allowed to perform operation");
        _;
    }

    function newPaintingForAdoption(string memory _name, uint256 pID, uint128 value)
    public onlyAdmin{
        addPainting(_name,pID,value,PaintingFor.Adoption);
    }

    function newPaintingForAuction(string memory _name, uint256 pID, uint128 value)
    public onlyAdmin{
        addPainting(_name,pID,value,PaintingFor.Auction);
    }

    function addPainting(string memory _name, uint256 pID, uint128 value, PaintingFor paintingType)
    private {
        DigiPainting memory painting = DigiPainting({
           name: _name,
           paintingID: pID,
           weiValue: value,
           pType: PaintingFor(paintingType)
        });

        bool mintStatus = deMuse.mint(address(this),pID);
        if(mintStatus && isAdoptPainting(painting)){
            emit AdoptionPaintingAdded(address(this),pID);
            adoptionPaintings.push(painting);
        }else if (mintStatus && !isAdoptPainting(painting)){
            emit AuctionPaintingAdded(address(this),pID);
            auctionPaintings.push(painting);
        }
        paintings[pID] = painting;
   }

    /**
     * @param painting structure instance of a Digipainting
     * @return true is the painting is an adoption painting
     */
    function isAdoptPainting(DigiPainting memory painting)
    private pure returns(bool){
        if(painting.pType == PaintingFor.Adoption){
           return true;
        }else {
           return false;
        }
    }

    /**
     * @return uint representing the number of adoption paintings
     */
    function numberOfAdoptionPaintings() external view returns (uint){
        return adoptionPaintings.length;
    }

    /**
     * @return uint representing the number of auction paintings
     */
    function numberOfAuctionPaintings() external view returns (uint){
        return auctionPaintings.length;
    }

    function getAdoptedBy(uint256 paintingId) external view returns(string memory){
        string memory empty = "";
        address adoptedBy = deMuse.ownerOf(paintingId);
        (string memory name, uint8 role) = userMgr.getUserInfo(adoptedBy);
        if(keccak256(abi.encodePacked((name))) == keccak256(abi.encodePacked((empty)))){
            return addressToString(adoptedBy);
        }else{
            return name;
        }
    }

    function addressToString(address _addr) private pure returns(string memory) {
    bytes32 value = bytes32(uint256(_addr));
    bytes memory alphabet = "0123456789abcdef";

    bytes memory str = new bytes(42);
    str[0] = '0';
    str[1] = 'x';
    for (uint i = 0; i < 20; i++) {
        str[2+i*2] = alphabet[uint(uint8(value[i + 12] >> 4))];
        str[3+i*2] = alphabet[uint(uint8(value[i + 12] & 0x0f))];
    }
    return string(str);
    }

    function tokenName() public view returns(string memory){
        return deMuse.name();
    }

    function tokenSymbol() public view returns(string memory){
        return deMuse.symbol();
    }

    function adoptionApproval(uint256 paintingId) public payable {
        require(userMgr.isRegisteredUser(msg.sender), "Only Registered Users can adopt a painting");
        require(!deMuse.isAdopted(paintingId),"Painting is already adopted ");

        uint adoptionValue = getAdoptionValue(paintingId);
        require(adoptionValue <= msg.value, "Adoption not possible for the value sent");

        deMuse.approve(msg.sender,paintingId);

        uint balance = msg.value - adoptionValue;
        msg.sender.transfer(balance);
    }

    function getAdoptionValue(uint256 paintingId) public view returns(uint256){
        DigiPainting memory painting = paintings[paintingId];
        return painting.weiValue;
    }

    function reverseAdoption(uint256 paintingId) public onlyAdmin {
        address adoptedBy = deMuse.ownerOf(paintingId);
        deMuse.safeTransferFrom(adoptedBy, address(this),paintingId);
    }
}