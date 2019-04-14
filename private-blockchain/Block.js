const hex2ascii = require('hex2ascii')
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
    this.body = data
    //necessary to avoid errors when an empty block is created on LevelSandox.getLevelDBData()
    if (this.body.star != null) {
      this.body.star.story = Buffer.from(data.star.story, 'ascii').toString('hex')
    }
    this.time = time;
    this.previousBlockHash = previousBlockHash;
  }

  /**
   * add the field storyDecode to body.star.
   * Necessary to call before the Block is returned through a GET method
   */
  decodeStory() {
      this.body.star.storyDecode = hex2ascii(this.body.star.story)
  }
}

module.exports.Block = Block;
