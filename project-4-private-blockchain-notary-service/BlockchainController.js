'use strict';

const SHA256 = require('crypto-js/sha256');
const BlockChain = require('./private-blockchain/BlockChain');
const Block = require('./private-blockchain/Block')
const Request = require('./Request')
const Validation = require('./Validation')

const EMPTY_DATA = ["", '""', "''", " ", '" "', "' '"]
const MAX_STRING_FIELD_BYTE_SIZE = 500

/**
* Controller Definition to encapsulate routes to work with blocks
*/
class BlockController {

  /**
  * Constructor to create a new BlockchainController
  * @param {*} server
  */
  constructor(server) {
    this.server = server;
    this.mempool = []
    this.mempoolValid = []
    this.blockChain = new BlockChain.Blockchain();

    // Automatic routing register
    // If a object function starts with 'get' or 'post', it is executed, registering its routing on the server.
    Object.getOwnPropertyNames(this.__proto__).forEach(attr => {
      if (typeof(this[attr]) == 'function') {
        if (attr.startsWith('get') || attr.startsWith('post')) {
          this[attr]()
        }
      }
    });
  }

  /**
  * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
  */
  getBlockByIndex() {
    this.server.route({
      method: 'GET',
      path: '/block/{index}',
      handler: async (request, h) => {
        let block = await this.blockChain.getBlock(Number(request.params.index))
        if (block == null) {
          console.log(`block ${request.params.index} not found`)
          return `{"error": "Block not in the chain", "height": "${request.params.index}"}`
        }
        block.decodeStory()
        return block
      }
    });
  }
  /**
  * Implement a GET Endpoint to retrieve a block by index, url: "/api/stars/hash:hash"
  */
  getBlockByHash() {
    this.server.route({
      method: 'GET',
      path: '/stars/hash:{hash}',
      handler: async (request, h) => {
        let hex_pattern = /^[0-9a-fA-F]+$/
        if (!hex_pattern.test(request.params.hash) || request.params.hash.length > 64) {
          return `{"error": "provided hash is not valid", "hash": "${request.params.hash}"}`
        }
        if (request.params.hash.length < 64) {
          return `{"error": "partial hash search is not supported"}`
        }
        let block = await this.blockChain.getBlockByHash(request.params.hash)
        if (block == null) {
          console.log(`block ${request.params.hash} not found`)
          return `{"error": "Block not in the chain", "hash": "${request.params.hash}"}`
        }
        block.decodeStory()
        return block
      }
    })
  }

  /**
  * Implement a GET Endpoint to retrieve a block by index, url: "/api/stars/address:address"
  */
  getBlocksByAddress() {
    this.server.route({
      method: 'GET',
      path: '/stars/address:{address}',
      handler: async (request, h) => {
        let blocks = await this.blockChain.getBlocksByAddress(request.params.address)
        if (blocks == null) {
          console.log(`block ${request.params.address} not found`)
          return `{"error": "no Block in the chain have this address", "address": "${request.params.address}"}`
        }
        blocks.map((block) => {return block.decodeStory()})
        return blocks
      }
    })
  }

  /**
  *
  * @param {*} data
  * @param {Array<string> | string} field
  * @param {Array<string>} empty_patterns
  * @return {boolean} is_empty
  */
  _isEmptyData(data, field, empty_patterns = EMPTY_DATA) {
    if (data == null) {
      throw new TypeError('{"error": "No JSON input."}')
    }
    //added recursion to support multiple fields checking
    if (typeof field == 'object') {
      for (var i in field) {
        this._isEmptyData(data, field[i], empty_patterns)
      }
    } else if (typeof field == 'string') {
      if (data[field] == null) {
        throw new TypeError(`{"error": "No ${field} key on JSON input."}`)
      }
      for (var i in empty_patterns) {
        if (data[field] == empty_patterns[i]) {
          throw new TypeError(`{"error": "${field} key is empty."}`)
        }
      }
    } else {
      throw new TypeError(`{"error": "${field} can not be checked if is empty or not}`)
    }
  }

  /**
   *
   * @param {string} story
   * @return {boolean} is_validStory
   */
  _isValidStarStory(story) {
    let ascii_range =  /^[\x00-\x7F]*$/
    if (!ascii_range.test(story) || Buffer.byteLength(story) > MAX_STRING_FIELD_BYTE_SIZE) {
      throw new TypeError(`{"error":"story exceeds maximum length of 500 bytes or isn't ASCII encoded}`)
    }
  }
  /**
   *
   * @param {JSON} json
   * @param {Array<string>} expected_field
   */
  _hasOnlyExpectedFields(json, expected_field) {
    let field = Object.keys(json)
    for (var i in field) {
      if (expected_field.indexOf(field[i]) == -1) {
        return `{"error": "unexpected field ${field[i]} found in request. Block not created}`
      }
    }
  }

  /**
  * Implement a POST Endpoint to add a new Block, url: "/api/block"
  */
  postNewBlock() {
    this.server.route({
      method: 'POST',
      path: '/block/',
      handler: async (request, h) => {
        try {
          this._isEmptyData(request.payload, ['address', 'star'])
          this._isEmptyData(request.payload.star, ['dec', 'ra', 'story'])

          // filter badly formatted requests with unexpected fields
          this._hasOnlyExpectedFields(request.payload, ['address', 'star'])
          this._hasOnlyExpectedFields(request.payload.star, ['dec', 'ra', 'story'])

          //checks whether story is ASCII and has maximum size of 500 bytes
          this._isValidStarStory(request.payload.star.story)
        } catch (err) {
          return err.message
        }
        //TODO Verify that the "address" that send the Star was validated in the previous steps, if not respond back with an error.
        let address = request.payload.address
        if(this.mempoolValid[address] == null) {
          return '{"error":"validation not found or expired."}'
        } else {
          this.mempoolValid[address] = null
        }
        let blockAux = new Block.Block(request.payload);
        await this.blockChain.addBlock(blockAux)
        return JSON.stringify(blockAux)
      }
    });
  }

  /**
  * Implement a POST endpoint to receive a validation for future submission of a star to the notary.
  */
  postRequestValidation() {
    this.server.route({
      method: 'POST',
      path: '/requestValidation/',
      handler: (request, h) => {
        try {
          this._isEmptyData(request.payload, 'address')
        } catch (err) {
          return err.message
        }
        let address = request.payload.address
        if (this.mempool[address] == null) {
          let new_request = new Request.Request(address)
          this.mempool[address] = new_request.prepareSelfDestruction(this.mempool)
        }
        return this.mempool[address].countTimeWindow()
      }
    })
  }

  postSignRequest() {
    this.server.route({
      method: 'POST',
      path: '/message-signature/validate/',
      handler: (request, h) => {
        try {
          this._isEmptyData(request.payload, ['address', 'signature'])
        } catch (err) {
          return err.message
        }
        let address = request.payload.address
        let signature = request.payload.signature
        if (this.mempool[address] != null) {
          let validation = new Validation.Validation(this.mempool[address], signature)
          this.mempoolValid[address] = validation.prepareSelfDestruction(this.mempoolValid)
          this.mempool[address] = null
        } else if (this.mempoolValid[address] == null) {
          return '{"error":"request validation not found or expired."}'
        }
        return this.mempoolValid[address].countTimeWindow().verifySignature(signature)
      }
    })
  }

  /**
  * Help method to initialized Mock dataset, adds 10 test blocks to the blocks array
  */
  initializeMockData() {
    this.blockChain.getBlockHeight().then((index) => {
      let self = this
      if (index > 0) {
        return
      }
      function theLoop(i) {
        setTimeout(function () {
          let blockTest = new Block.Block('Test Block - ' + (i + 1));
          self.blockChain.addBlock(blockTest).then((result) => {
            console.log(result);
            i++;
            if (i < 10) theLoop(i);
          });
        }, 300);
      };
      theLoop(0)
    })
  }
}

/**
* Exporting the BlockController class
* @param {*} server
* @param {boolean} populate_data
*/
module.exports = (server) => { return new BlockController(server);}