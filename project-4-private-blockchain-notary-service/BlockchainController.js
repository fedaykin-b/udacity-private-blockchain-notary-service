'use strict';

const SHA256 = require('crypto-js/sha256');
const BlockChain = require('./private-blockchain/BlockChain');
const Block = require('./private-blockchain/Block')

const EMPTY_DATA = ['""', "''", " ", '" "']
/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockchainController
     * @param {*} server
     */
    constructor(server, populate_data) {
        this.server = server;
        this.blockChain = new BlockChain.Blockchain();
        if (populate_data) {
            this.initializeMockData();
        }        
        this.getBlockByIndex();
        this.postNewBlock();
        this.postRequestValidation();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.server.route({
            method: 'GET',
            path: '/block/{index}',
            handler: async (request, h) => {
                let block = await this.blockChain.getBlock(request.params.index)
                if (block == null) {
                    console.log(`block ${request.params.index} not found`)
                    return `{"error": "Block not in the chain", "height": "${request.params.index}"}`
                }
                return block
            }
        });
    }

    /**
     * 
     * @param {*} data 
     * @param {string} field 
     * @param {Array<string>} empty_patterns 
     * @return {boolean} is_empty
     */
    _isEmptyData(data, field, empty_patterns = EMPTY_DATA) {
      if (data == null || data[field] == null) {
        return true
      }
      for (var p in empty_patterns) {
        if (data[field] == p) {
          return true
        }
      }
      return false
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/block/',
            handler: async (request, h) => {
                let index = await this.blockChain.getBlockHeight() + 1;
                if (this._isEmptyData(request.payload, 'body')) {
                    return `{"error": "There was no input or body was empty. Block not created", "height": "${index}"}`
                }
                let blockAux = new Block.Block(request.payload.body);
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
          if(this._isEmptyData(request.payload, 'address')) {
            return '{"error": "No address field on JSON input. Validation not created"}'
          }
          return 'Not implemented'
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
 */
module.exports = (server, populate_data) => { return new BlockController(server, populate_data);}