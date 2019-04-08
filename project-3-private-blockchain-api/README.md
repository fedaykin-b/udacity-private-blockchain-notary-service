# Udacity Nanodegree "Blockchain Developer"

## Project #3. Private Blockchain

An improvement over [Project 2](https://github.com/brunoarruda/Udacity-Nanodegree-Blockchain-Developer/tree/projeto-2/project-2-private-blockchain), adding an API to get blocks with GET method and add data to a block with POST method.

### Installing

To setup the project for review do the following:

1. Download the project.
2. Run command ```npm install``` to install the project dependencies.

### Testing

Run command ```node app.js``` in the root directory to start the server on port 8000.

Add parameter ```-p``` or ```--populate-data``` to add 10 initials blocks in the blockchain. It will have no effect if there is already blocks beyond the genesis block.

Once the server is running, use POSTMAN or Curl to call GET and POST methods.

-----

### Syntax to test the API

**GET**:

```http://localhost:8000/block/h``` should return a JSON string representing the block with height ```h```.

In case there is no such a block, the API will return an JSON as below:

```json
{
    "error": "Block not in the chain",
    "height": "h"
}
```

**POST**

```http://localhost:8000/block/``` creates a new Block. Data should be on the body of message, in the form:

```json
{
    "body": "content to be added to chain"
}
```

 Be sure to set ```Content-type``` to ```application/json``` on the POST request.

blocks with empty body should not be accepted, so it was added to [```INVALID_DATA```](BlockchainController.js#L7) some common representations of empty strings that could be put by a user. In case where ```content``` is rejected, the API will return an JSON as below:

```json
{
    "error": "Invalid or empty block body. Block not created",
    "height": "height"
}
```

-----

### Built with

- [crypto-js](https://github.com/brix/crypto-js) for generating hash of the blocks
- [LevelDB](https://github.com/google/leveldb) for store and retrieving of blocks
- [yargs](https://github.com/yargs/yargs) for command line parameters
- [hapi](https://github.com/hapijs/hapi) for API endpoints configuration
