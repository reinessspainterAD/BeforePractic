// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract TransferMoneySystem{
    struct User {
        address userAddress;
        string username;
        bool isAdmin;
        string login;
        bytes32 password;
    }

    mapping(address => User) public users;
    address[] public userAddresses;
    
    struct app_promotion {
        address user;
        address[] admin_vote;
        bool close;
    }

    app_promotion[] public app_promotions;

    function getUserAddressesCount() public view returns(uint) {
        return userAddresses.length;
    }


    struct Transaction{
        uint id;
        address sender;
        address receiver;
        uint amount;
        string category;
        string description;
        bytes32 keyword;
        bool isConfirmed;
        bool isCancelled;
        uint256 timestamp;
    }

    Transaction[] public transactions;

    struct Categories{
        uint id;
        string title;
    }
    Categories[] public categories;

    function getCategoryArray() public view returns(Categories[] memory){
        return categories;
    }

    function getTranArray() public view returns(Transaction[] memory){
        return transactions;
    }

    constructor() {
        users[0x3077D5D952B8BFeb2D5E898B21b655a246358498] = User(0x3077D5D952B8BFeb2D5E898B21b655a246358498, "reinessspainter", true, "test1", 0x7465737431000000000000000000000000000000000000000000000000000000);
        userAddresses.push(0x3077D5D952B8BFeb2D5E898B21b655a246358498);
        users[0xE670a7ba45bEBe7c99b7617DEFc2CAc994D627F7] = User(0xE670a7ba45bEBe7c99b7617DEFc2CAc994D627F7, "shadInThePast", true, "test2", 0x7465737432000000000000000000000000000000000000000000000000000000);
        userAddresses.push(0xE670a7ba45bEBe7c99b7617DEFc2CAc994D627F7);
        users[0xFcd381D2D201BA840DEd6e152840140F929FAA8B] = User(0xFcd381D2D201BA840DEd6e152840140F929FAA8B, "littleSadnessNeverHurts", false, "test3", 0x7465737433000000000000000000000000000000000000000000000000000000);
        userAddresses.push(0xFcd381D2D201BA840DEd6e152840140F929FAA8B);
        users[0x7BBb87de4c6DfB3EB22185769240eCb7317f2136] = User(0x7BBb87de4c6DfB3EB22185769240eCb7317f2136, "onlyFutureHoldsYourPurpose", false, "test4", 0x7465737434000000000000000000000000000000000000000000000000000000);
        userAddresses.push(0x7BBb87de4c6DfB3EB22185769240eCb7317f2136);
        users[0x2137d81f16783AFCC0012fbb6639E409fc43EdF7] = User(0x2137d81f16783AFCC0012fbb6639E409fc43EdF7, "iAmTired", false, "test5", 0x7465737435000000000000000000000000000000000000000000000000000000);
        userAddresses.push(0x2137d81f16783AFCC0012fbb6639E409fc43EdF7);
        users[0x9A360c55abaeB04A7f5d010CFA8B9b65abd54f9B] = User(0x9A360c55abaeB04A7f5d010CFA8B9b65abd54f9B, "cakeIsALie", false, "test6", 0x7465737436000000000000000000000000000000000000000000000000000000);  
        userAddresses.push(0x9A360c55abaeB04A7f5d010CFA8B9b65abd54f9B);    
        categories.push(Categories(0, "Communal services"));
        categories.push(Categories(1, "Personal transaction"));
    }

    modifier onlyAdmin(){
        require(users[msg.sender].isAdmin == true, "Only admin can call this function");
        _;
    }

    modifier userExists(address userAddress){
        require(users[userAddress].userAddress == userAddress, "User does not exist");
        _;
    }

    modifier sufficientBalance(uint amount){
        require(msg.value >= amount, "Insufficient balance");
        _;
    }

    function addUser(address userAddress, string memory username, string memory login, bytes32 password) public{
        require(users[userAddress].userAddress != userAddress, "User already exists");
        User memory newUser;
        newUser.userAddress = userAddress;
        newUser.username = username;
        newUser.isAdmin = false;
        newUser.login = login;
        newUser.password = password;
        users[userAddress] = newUser;
        userAddresses.push(userAddress);
    }

    function viewPromotion() private {
        uint len;
        for (uint j; j < userAddresses.length; j++){
            if (users[userAddresses[j]].isAdmin) {
                ++len;
            }
        }
        for (uint i; i < app_promotions.length; i++){
            if (!app_promotions[i].close) {
                if (app_promotions[i].admin_vote.length == len) {
                    users[app_promotions[i].user].isAdmin = true;
                    app_promotions[i].close = true;
                }
            }
        }
    }

    //  Повышение до админа
    function promotion (address _login) public {
        require(users[msg.sender].isAdmin,"Not admin");
        require(msg.sender != _login,"Must not");
        require(!users[_login].isAdmin,"Admin");
        for (uint i; i < app_promotions.length; i++) {
            require(app_promotions[i].user != _login,"voting already");
        }
        address[] memory _admin_vote;
        app_promotions.push(app_promotion(_login, _admin_vote, false));
        app_promotions[app_promotions.length-1].admin_vote.push(msg.sender);
        viewPromotion();
    }

    //Проголосовать для повышения
    function vote_promotion (uint id) public {
        require(users[msg.sender].isAdmin,"Not admin");
        for (uint i; i < app_promotions[id].admin_vote.length; i++){
            require(app_promotions[id].admin_vote[i] != msg.sender,"You can't vote twice");
        }
        app_promotions[id].admin_vote.push(msg.sender);
        viewPromotion();
    }

    function addCategory(string memory title) public {
        Categories memory newCategory;
        newCategory.id = categories.length;
        newCategory.title = title;
        categories.push(newCategory);
    }

    function addTransaction(address receiver, string memory category, string memory description, bytes32 keyword) external userExists(receiver) payable {
        uint amount = msg.value;
        require(amount != 0, "insufficient amount");
        require(msg.sender != receiver, "sender and receiver cannot be the same");
        transactions.push(Transaction(transactions.length, msg.sender, receiver, amount, category, description, keyword, false, false, block.timestamp));
    }

    function acceptTransaction(uint transactionId, bytes32 keyword) public payable {
        require(transactions[transactionId].id == transactionId, "Transactions does not exists");
        require(msg.sender == transactions[transactionId].receiver, "You are not the receiver of this transaction");
        require(!transactions[transactionId].isConfirmed, "Transaction already been confirmed"); 

        if(transactions[transactionId].keyword == keyword){
            payable(transactions[transactionId].receiver).transfer(transactions[transactionId].amount);
            transactions[transactionId].isConfirmed = true;
        }else{
            payable(transactions[transactionId].sender).transfer(transactions[transactionId].amount);
            transactions[transactionId].isCancelled = true;
        }
    }

    function cancelTransaction(uint transactionId) public payable {
        require(transactions[transactionId].id == transactionId, "Transaction does not exists");
        require(msg.sender == transactions[transactionId].sender, "You are not the sender of this transaction");
        require(!transactions[transactionId].isConfirmed, "Transaction already been confirmed");
        payable(transactions[transactionId].sender).transfer(transactions[transactionId].amount);
        transactions[transactionId].isCancelled = true;
    }
}