/* ===== Crypto-js library ==========================
|  Learn more: https://github.com/brix/crypto-js    |
/==================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

/**
 * Class that represents a Blockchain
 */
class Blockchain {
  /**
   * Creates a Blockchain and generates Genesis Block, if needed.
   */
  constructor() {
    this.bd = new LevelSandbox.LevelSandbox();
    this.generateGenesisBlock();
  }

  /**
   * Helper method to create a Genesis Block. It only has effects when there are no blocks in the chain.
   */
  generateGenesisBlock() {
    this.getBlockHeight()
        .then((height) => {
          if (height == -1) {
            this.addBlock(new Block.Block('genesis block!'))
                .then((block) => {
                  console.log(`Chain started with Genesis block: ${block}`);
                });
          }
        });
  }

  /**
   * Get block height, it is a helper method that return the height of the current block on Blockchain
   * @return  {Promise<number>} A Promise that represent the current chain height
   */
  getBlockHeight() {
    return this.bd.getBlocksCount()
        .then(function(count) {
          return count -1;
        });
  }

  /**
   * Print the blockchain on console
   * @return {Promise<string>} - A Promise that resolves with the string of all the blocks, or rejects with Error.
   */
  getBlockChain() {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getBlockHeight()
          .then((count) => {
            let output = [];
            let promisePool = [];
            for (let i = 0; i <= count; i++) {
              promisePool.push(self.getBlock(i)
                  .then(function(block) {
                    output[i] = JSON.stringify(block, null, ' ');
                  }, function(err) {
                    output[i] = `Block #${i} could not be retrieved.`;
                  }));
            }
            Promise.all(promisePool)
                .then(function() {
                  resolve(output.join('\n'));
                })
                .catch((err) => {
                  reject(err);
                });
          });
    });
  }

  /**
   * Add new block
   * @param {Block.Block} block - A block object
   * @return {Promise<Block.Block|Error>} - A Promise that resolves returning the accepted Blocks or rejects with Error.
   */
  addBlock(block) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getBlockHeight()
          .then((count) => {
            block.height = count + 1;
            if (block.height > 0) {
              return self.getBlock(count)
                  .then((previousBlock) => {
                    block.previousBlockHash = previousBlock.hash;
                    return block;
                  });
            } else {
              return block;
            }
          })
          .then((block) => {
            block.time = new Date().getTime().toString().slice(0, -3);
            block.hash = SHA256(JSON.stringify(block)).toString();
            self.bd.addLevelDBData(block.height, JSON.stringify(block))
                .then((block) => {
                  console.log(`Block #${JSON.parse(block).height} added with success`);
                  resolve(block);
                })
                .catch((err) => {
                  console.log(`Could not insert Block ${block.height} into chain`);
                  reject(err);
                });
          });
    });
  }

  /**
   * Get Block By Height
   * @param {number} height - the height of the block to be recovered
   * @return {Promise<Block.Block|Error>} - A Promise that resolves returning the block or reject with Error
   */
  getBlock(height) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.bd.getLevelDBData(height)
          .then(function(value) {
            if (typeof value === 'undefined') {
              resolve();
            } else {
              resolve(JSON.parse(value));
            }
          })
          .catch(function(err) {
            reject(err);
          });
    });
  }

  //
  /**
   * Validate if Block is being tampered by Block Height
   * @param {number} height
   * @return {Promise} A Promise that resolves returning true or rejects with Error
   */
  validateBlock(height) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getBlock(height)
          .then((block) => {
            if (height > 0) {
              return self.getBlock(height - 1)
                  .then((previousBlock) => {
                    if (previousBlock.hash != block.previousBlockHash) {
                      let msg = `Block #${block.height} previous Block hash is ${block.previousBlockHash},`;
                      msg = msg + ` but should be ${previousBlock.hash}`;
                      reject(Error(msg));
                    }
                    return block;
                  });
            } else {
              return block;
            }
          })
          .then((block) => {
            let unchainedBlock = new Block.Block(block.body, block.time, block.height, block.previousBlockHash);
            unchainedBlock.hash = '';
            unchainedBlock.hash = SHA256(JSON.stringify(unchainedBlock)).toString();
            if (unchainedBlock.hash != block.hash) {
              let msg = `the hash of the block #${block.height} is ${block.hash}, but should be ${unchainedBlock.hash}`;
              reject(Error(msg));
            }
            resolve(true);
          })
          .catch((err) => {
            if (err instanceof TypeError) {
              reject(Error(`Block ${height} does not exists yet`));
            }
          });
    });
  }

  /**
   * Validate Blockchain
   * @return {Promise} A Promise that resolves returning true or rejects with Error containing a list of bad blocks
   */
  validateChain() {
    let self = this;
    return new Promise(function(resolve, reject) {
      let badBlocks = [];
      let promisePool = [];
      self.getBlockHeight()
          .then((count) => {
            for (let i = 0; i <= count; i++) {
              promisePool.push(self.validateBlock(i)
                  .then(function() {
                    // all right, nothing happens
                  }, function(err) {
                    badBlocks.push(err);
                  }));
            }
            Promise.all(promisePool).then(function() {
              if (badBlocks.length > 0) {
                reject(badBlocks);
              } else {
                resolve(true);
              }
            });
          });
    });
  }

  /**
   * Utility Method to Tamper a Block for Test Validation. This method is for testing purpose
   * @param {int} height
   * @param {Block} block
   * @return {Promise} A promise that resolves returning the modified block or rejects with error
   */
  _modifyBlock(height, block) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
        resolve(blockModified);
      }).catch((err) => {
        console.log(err); reject(err);
      });
    });
  }
}

module.exports.Blockchain = Blockchain;
