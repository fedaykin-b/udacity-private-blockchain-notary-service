/**
 * Class representing a Block in the Blockchain
 */
class Block {
  /**
   * constructor
   * @param {*} data
   * @param {number} [time=0] - the timestamp of when the Block was hashed
   * @param {number} [height=0] - the height of block on the chain
   * @param {string} [previousBlockHash=''] - previous Block hash
   */
  constructor(data, time = 0, height = 0, previousBlockHash = '') {
    this.hash = '';
    this.height = height;
    this.body = data;
    this.time = time;
    this.previousBlockHash = previousBlockHash;
  }
}

module.exports.Block = Block;
