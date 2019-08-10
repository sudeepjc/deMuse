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
        UserManager um = UserManager(mgrAddress);
        admin = um.getAdmin();
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

        bool mintStatus = mint(address(this),pID);
        if(mintStatus && isAdoptPainting(painting)){
            emit AdoptionPaintingAdded(address(this),pID);
            adoptionPaintings.push(painting);
        }else if (mintStatus && !isAdoptPainting(painting)){
            emit AuctionPaintingAdded(address(this),pID);
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
}