var Book = artifacts.require('Book');

contract('Book', function(accounts) {
  it('should purchase coin correctly', function() {
    let instance;
    return Book.new(accounts[0], 0, 100, 100, 15, 10000, 8, 'test', {
      from: accounts[0],
    })
      .then(inst => {
        instance = inst;
        return instance.buyCoin({ from: accounts[0], value: 100 });
      })
      .then(() => {
        return instance.getFirstInLine();
      })
      .then(first => {
        assert.equal(
          accounts[0],
          first,
          'The only buyer should be first in line',
        );
      });
  });

  it('first in line should not change when someone buys same amount', function() {
    let instance;
    return Book.new(accounts[0], 0, 100, 100, 15, 10000, 8, 'test', {
      from: accounts[0],
    })
      .then(inst => {
        instance = inst;
        return instance.buyCoin({ from: accounts[0], value: 100 });
      })
      .then(() => {
        return instance.buyCoin({ from: accounts[1], value: 100 });
      })
      .then(() => {
        return instance.getFirstInLine();
      })
      .then(first => {
        assert.equal(
          accounts[0],
          first,
          'The first buyer should be first in line',
        );
      });
  });

  it('first in line should not change when someone buys more', function() {
    let instance;
    return Book.new(accounts[0], 0, 100, 100, 15, 10000, 8, 'test', {
      from: accounts[0],
    })
      .then(inst => {
        instance = inst;
        return instance.buyCoin({ from: accounts[0], value: 100 });
      })
      .then(() => {
        return instance.buyCoin({ from: accounts[1], value: 99 });
      })
      .then(() => {
        return instance.buyCoin({ from: accounts[1], value: 1 });
      })
      .then(() => {
        return instance.buyCoin({ from: accounts[2], value: 99 });
      })
      .then(() => {
        return instance.getFirstInLine();
      })
      .then(first => {
        assert.equal(
          accounts[0],
          first,
          'Account 0 should be the first in line',
        );
      });
  });

  it('should set first eligible and continue to the next in line', function() {
    let instance;
    return Book.new(accounts[0], 0, 100, 100, 15, 10000, 8, 'test', {
      from: accounts[0],
    })
      .then(inst => {
        instance = inst;
        console.log('TEST1');
        return instance.buyCoin({ from: accounts[0], value: 100 }); // [account0]
      })
      .then(() => {
        console.log('TEST2');
        return instance.buyCoin({ from: accounts[3], value: 99 }); // [account0] [account3]
      })
      .then(() => {
        console.log('TEST3');
        return instance.buyCoin({ from: accounts[1], value: 99 }); // [account0] [account3, account1]
      })
      .then(() => {
        console.log('TEST4');
        return instance.buyCoin({ from: accounts[4], value: 1 }); // [account4] [account0] [account3, account1]
      })
      .then(() => {
        console.log('TEST5');
        return instance.buyCoin({ from: accounts[2], value: 50 }); // [account0]  [account3, account1] [account2] [account4]
      })
      .then(() => {
        console.log('TEST6');
        return instance.getFirstInLine();
      })
      .then(first => {
        console.log('TEST7');
        assert.equal(accounts[0], first, 'Account 0 should be first in line');
      })
      .then(() => {
        console.log('TEST8');
        return instance.setFirstEligible({ from: accounts[0] });
      })
      .then(() => {
        console.log('TEST9');
        return instance.getFirstInLine();
      })
      .then(first => {
        console.log('TEST10');
        assert.equal(accounts[3], first, 'Account 3 should be first in line');
      })
      .then(() => {
        console.log('TEST11');
        return instance.setFirstEligible({ from: accounts[0] });
      })
      .then(() => {
        console.log('TEST12');
        return instance.getFirstInLine();
      })
      .then(first => {
        console.log('TEST13');
        assert.equal(accounts[1], first, 'Account 1 should be first in line');
      });
  });

  it('should not set first eligible when goal is not met', function() {
    let instance;
    return Book.new(accounts[0], 0, 100, 99, 15, 10000, 8, 'test', {
      from: accounts[0],
    })
      .then(inst => {
        instance = inst;
        return instance.buyCoin({ from: accounts[0], value: 100 }); // [account0]
      })
      .then(() => {
        return instance.setFirstEligible({ from: accounts[0] });
      })
      .then(() => {
        return instance.getFirstInLine();
      })
      .then(first => {
        assert.equal(accounts[3], first, 'Account 3 should be first in line');
      })
      .then(() => {
        return instance.setFirstEligible({ from: accounts[0] });
      })
      .then(() => {
        assert.equal(true, false, 'We should be throwing an error');
      })
      .catch(e => {
        assert.notEqual(e, undefined, 'Expect to throw error');
        assert.notEqual(e, null, 'Expect to throw error');
      });
  });
});
