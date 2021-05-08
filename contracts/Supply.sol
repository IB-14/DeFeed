pragma solidity ^0.5.0;

contract Supply{
    string public name="Supply";

    //storing supplies
    uint public productCount=0;
    mapping(uint => Product) public products;

    //structure of post in db
    struct Product{
        uint id;
        string hash;
        string name;
        uint price;
        address payable author;
    }

    event ProductCreated(
        uint id,
        string hash,
        string name,
        uint price,
        address payable author
    );

    event ProductPayed(
        uint id,
        string hash,
        string name,
        uint price,
        address payable author
    );

    //creating product
    function uploadProduct(string memory _imgHash,string memory _name,uint _price) public{
        require(bytes(_name).length > 0);//checking for product description
        require(bytes(_imgHash).length > 0); //checking for image
        require(msg.sender!=address(0x0)); //message sender is not empty address

        productCount++;

        //adding supply to contract
        products[productCount]=Product(productCount,_imgHash,_name,_price,msg.sender);

        //triggering event after adding supply
        emit ProductCreated(productCount,_imgHash,_name,_price,msg.sender);
    }

    function payProductOwner(uint _id) public payable{
        require(_id>0&&_id<=productCount); //checking if id of post is valid

        Product memory _product=products[_id];
        require(_product.price==msg.value);
        address payable _author=_product.author;

        address(_author).transfer(msg.value);

        emit ProductPayed(_id, _product.hash, _product.name, _product.price, _author); 
    }

    
}