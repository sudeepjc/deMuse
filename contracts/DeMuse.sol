pragma solidity ^0.5.10;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";

/**
   DeMuse , a decentralized musuem for painting auctio/adoption
    @title : DeMuse contract and Token
*/
contract DeMuse is ERC721Mintable,ERC721Full{

    address museum;
    address admin;

    constructor() ERC721Full("DeMuse", "DEM") public {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin,"Only Admin allowed to perform operation");
        _;
    }

    function setMuseumAddress(address museumAddress) public onlyAdmin {
        museum = museumAddress;
    }

    function adoptAndApproveMuseum(uint256 tokenId) public payable {
        safeTransferFrom(museum,msg.sender, tokenId);
        approve(museum,tokenId);
    }

    function isAdopted(uint256 tokenId) public view returns(bool){
        address adopter = ownerOf(tokenId);
        if(adopter == museum){
            return false;
        }else{
            return true;
        }
    }
}