//BookPub - Decentralized Book Self-Publishing Platform
//Must work for many, many authors
//Assume authors might have as many as 10,000,000 fans
//Gonna be sweet!
//------------------------------------------------------*

/* Summary:
// Authors fund book publishing by selling licensing equity via micro crowd funding
1) Publish contract with initial supply of 0 and sell coins at fixed price
2) Readers purchase coins to reveal ebook download, and get in line for a hard copy
3) Any amount of coins purchased is acceptable, price as low as a penny if you like
4) The more coins you hold, the higher in line you get to receive your hard copy
5) Every coin you own represents a small piece of equity in licensing rights
6) Equity is determined by the number of coins you hold in proportion to total supply
7) When certain funding goals are met, users at the top of the line are shipped a hard copy
8) Coin holders are legally entitled to licesnsing revenue if a deal is made with a publisher, movie studio, amusementpark, etc.
*/

pragma solidity ^0.4.15;

import "./Stoppable.sol";
import './Book.sol';

contract BookPub is Stoppable {
  uint bookID;            //ID applied to book upon pub, incrementing after each new book

  mapping(address => BookStruct[]) bookMap;
  BookStruct[] public books;

  struct BookStruct {
    uint bookID;                 //Global book ID ++1
    address publishedAddress;
    address authorAddress;       //Who was the author? Can be used to access Authors mapping
    uint readershipStake;         //How much equity did the author provision for readers?
  }

  function publishBook
    (
     uint _readershipStake,
     uint _goal,
     uint _toBeShipped,
     uint _userCount,
     uint _eligibleCount,
     uint _initialAmount,
     string _tokenName,
     uint8 _decimalUnits,
     string _tokenSymbol
    )
    returns (address bookAddress)
  {
    bookID += 1;

    Book newBook = new Book(msg.sender, _readershipStake, _goal, _toBeShipped, _userCount,
                            _eligibleCount, _initialAmount, _tokenName, _decimalUnits, _tokenSymbol);

    BookStruct memory book = BookStruct({
      bookID: bookID,
      publishedAddress: newBook,
      authorAddress: msg.sender,
      readershipStake: _readershipStake
    });

    bookMap[msg.sender].push(book);
    books.push(book);
    return newBook;
  }

}
