pragma solidity >=0.4.21 <0.7.0;

contract DeFeed {
    string public name= "DeFeed";
    uint storedData;
    
    // function set(uint x) public {
    //     storedData = x;
    // }

    // function get() public view returns (uint) {
    //     return storedData;
    // }

    // Storing Posts
    uint public postCount= 0;
    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        string hash;
        string description;
        uint donation;
        address payable author;
    }

    event postCreated(
        uint id,
        string hash,
        string description,
        uint donation,
        address payable author
    );

    event postDonation(
        uint id,
        string hash,
        string description,
        uint donation,
        address payable author
    );

    // Creating Posts
    function uploadPost(string memory postHash, string memory description) public {
        
        // Validations
        require(bytes(postHash).length > 0); // Checking if Post Hash Exists
        
        require(bytes(description).length > 0); // Checking if Post Description Exists
        
        require(msg.sender != address(0x0)); // Checking if Uploader Address Exists

        // Incrementing Post Count
        postCount ++; 

        // Adding Posts to contract
        posts[postCount]= Post(postCount, postHash, description, 0, msg.sender);

        // Event Triggering
        emit postCreated(postCount, postHash, description, 0, msg.sender);
    }

    // Donating
    function donatePostAuthor(uint id) public payable {
        
        require(id > 0 && id <= postCount);

        // Fetch Post
        Post memory post= posts[id];
        address payable author= post.author;
        
        //Paying Author with Ether
        address(author).transfer(msg.value);

        // Increment the Donation Amount
        post.donation= post.donation + msg.value;

        // Update the Post
        posts[id]= post;

        // Event Triggering
        emit postDonation(id, post.hash, post.description, post.donation, author);
    }
}

