pragma solidity ^0.5.10;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";

import "./UserManager.sol";

/**
   DeMuse , a decentralized musuem for painting auctio/adoption
    @title : DeMuse contract and Token
*/
contract DeMuse is ERC721Mintable,ERC721Full,ERC721Holder{

    address public admin;
    UserManager userMgr;

    event AdoptionPaintingAdded(address indexed owner,uint256 paintingID);
    event AuctionPaintingAdded(address indexed owner,uint256 paintingID);

    enum PaintingFor {Adoption, Auction}

    /**
     * Structurefor paintings
     */
    struct DigiPainting{
        string name;
        uint256 paintingID;
        uint128 tokenCount;
        PaintingFor pType;
    }

    DigiPainting[] public adoptionPaintings;
    DigiPainting[] public auctionPaintings;

    modifier onlyAdmin() {
        require(msg.sender == admin,"Only Admin allowed to perform operation");
        _;
    }

    constructor( address mgrAddress) ERC721Full("DeMuse", "DEM") public {
        userMgr = UserManager(mgrAddress);
        admin = userMgr.getAdmin();
    }

    function newPaintingForAdoption(string memory _name, uint256 pID, uint128 tCount)
    public onlyAdmin{
        addPainting(_name,pID,tCount,PaintingFor.Adoption);
    }

    function newPaintingForAuction(string memory _name, uint256 pID, uint128 tCount)
    public onlyAdmin{
        addPainting(_name,pID,tCount,PaintingFor.Auction);
    }

    function addPainting(string memory _name, uint256 pID, uint128 tCount, PaintingFor paintingType)
    private {
        DigiPainting memory painting = DigiPainting({
           name: _name,
           paintingID: pID,
           tokenCount: tCount,
           pType: PaintingFor(paintingType)
        });

        bool mintStatus = mint(admin,pID);
        if(mintStatus && isAdoptPainting(painting)){
            emit AdoptionPaintingAdded(admin,pID);
            adoptionPaintings.push(painting);
        }else if (mintStatus && !isAdoptPainting(painting)){
            emit AuctionPaintingAdded(admin,pID);
            auctionPaintings.push(painting);
        }
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
        address adoptedBy = ownerOf(paintingId);
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
}