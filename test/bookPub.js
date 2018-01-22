var Book = artifacts.require('Book');
var BookPub = artifacts.require('BookPub');

contract('Book', function(accounts) {
  it.only('should purchase coin correctly', function() {
    let instance;
    return BookPub.deployed()
      .then(inst => {
        instance = inst;
      })
      .then(() => {
        return instance.publishBook(
          100,
          '1000',
          '100',
          '100',
          '100',
          '1000',
          'TEST',
          '18',
          'TST',
          { from: accounts[0] },
        );
        //return instance.buyCoin({ from: accounts[0], value: 100 });
      })
      .then(wtf => {
        console.log(wtf);
        return instance.books(0);
        //return instance.getFirstInLine();
      })
      .then(books => {
        console.log('books: ', books);
        /*assert.equal(
          accounts[0],
          first,
          'The only buyer should be first in line',
          );*/
      });
  });
});
