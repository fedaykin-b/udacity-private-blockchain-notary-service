# Udacity Nanodegree "Blockchain Developer"

## Project #4. Private Blockchain for a Decentralized Star Notary Service

An improvement over [Project 3 - A Private Blockchain with API](https://github.com/brunoarruda/Udacity-Nanodegree-Blockchain-Developer/tree/master/project-3-private-blockchain-api).

This project implements a decentralized Star Notary Service, which allows to register information about stars after a request validation step.

## Installing

To setup the project for review do the following:

1. Download the project.
2. Run command ```npm install``` to install the project dependencies.

## Testing

Run command ```node app.js``` in the root directory to start the server on port 8000.

Once the server is running, use POSTMAN or Curl to call GET and POST methods.

-----

## API description

### GET methods

#### /block/h

returns a JSON string representing the block with height ```h```.

##### Parameters

```h```: number. It's height of the block

##### Result

the block with desired height. an example of return

```json
{
    "hash": "65b453c8c7123cc5552836eae03d04a994f9318e446692c79b517b6b9fb2072e",
    "height": 1,
    "body": {
        "address": "n4CmtZCpseQJGa4Wn3He3tCtAp4S5s76Qg",
        "star": {
            "dec": "40° 57' 20.332",
            "ra": "03h 08m 10.1315s",
            "story": "416c676f6c20537461722c20616c736f206b6e6f776e2061732042657461205065727365692c206d65616e73202764656d6f6e2720696e206172616269632c20616e6420697320776865726520746865206f726967696e616c2070617274206f6620525047205365726965205068616e746173792053746172206973207365742e",
            "storyDecode": "Algol Star, also known as Beta Persei, means 'demon' in arabic, and is where the original part of RPG Serie Phantasy Star is set."
        }
    },
    "time": "1555196274",
    "previousBlockHash": "963bec74833dc30ed5c1ff292d99a285fe1e7518b84bd9e371413f1892df671b"
}
```

In case there is no such a block, the API will return an JSON as below:

```json
{
    "error": "Block not in the chain",
    "height": "h"
}
```

#### /stars/hash:h

returns a JSON string of the block with hash ```h```.

##### Parameters

```h```: string. It's hash of the block.

##### Result

The results include those of [/block/h](./README.md#blockh).

Additionally, if the string is not hexadecimal or bigger than 65 chars, the response will be:

```json
{
    "error": "provided hash is not valid",
    "hash": "h"
}
```

if the hash is smaller than it should be, the result is different, because it could be possible to implement such a functionality in the future:

```json
{"error": "partial hash search is not supported"}
```

#### /stars/address:a

returns a JSON with a list of blocks submitted by an address ```a```.

##### Parameters

```a```: string. It's the address to be found inside block body.

##### Result

In case it was found blocks with the address, the result will be a JSON list with nested objects similar to [/block/h](./README.md#blockh)

In case there is no block with that address, the API will return an JSON as below:

```json
{
    "error": "no Block in the chain have this address",
    "address": "a"
}
```

### POST methods

**ATTENTION:** Data must be in JSON and sent in the body of message to POST requests. Be sure to set ```Content-type``` to ```application/json``` on the header of the request.

#### /requestValidation/

creates a new request to publish on network.

##### Parameters

- ```address```: string. An valid bitcoin wallet address.

Example of input below.

```json
{"address": "n4CmtZCpseQJGa4Wn3He3tCtAp4S5s76Qg"}
```

##### Result

a JSON string of a Request object with pending validation. For example:

```json
{
    "address": "n4CmtZCpseQJGa4Wn3He3tCtAp4S5s76Qg",
    "requestTimeStamp": "1555196258",
    "message": "n4CmtZCpseQJGa4Wn3He3tCtAp4S5s76Qg:1555196258:starRegistry",
    "validationWindow": 300
}
```

multiples calls with the same address will return the same object, until it expires. If it has expired, the method will create and send a new request.

if ```address``` is empty, a message of error is returned instead:

```json
{"error": "address key is empty."}
```

#### /message-signature/validate/

validates a pending [request](./README.md#requestValidation) to publish on network.

##### Parameters

- ```address```: string. An valid bitcoin wallet address.
- ```signature```:string. The signature by ```address``` of the ```message``` content of a related request pending of validation.

Example of input below.

```json
{
    "address" : "n4CmtZCpseQJGa4Wn3He3tCtAp4S5s76Qg",
    "signature":"IOdKIGtgMbnUBYbHgMxdEk+Tfv9Z5bU3tybfYpsDmwxVKvgPwmeVP2wBQpiJzyQxZZ9mjM1s8yGGJp7POjRRtio="
}
```

##### Result

a JSON string of a Validation object. An example:

```json
{
    "registerStar": true,
    "status": {
        "address": "n4CmtZCpseQJGa4Wn3He3tCtAp4S5s76Qg",
        "requestTimeStamp": "1555196258",
        "message": "n4CmtZCpseQJGa4Wn3He3tCtAp4S5s76Qg:1555196258:starRegistry",
        "validationWindow": 299,
        "messageSignature": true
    }
}
```

multiples calls with the same address will return the same validation, until it expires.

if ```address``` or ```signature```  is empty, a message of error is returned instead:

```json
{"error": "address key is empty."}
```

If there is no [request pending of validation](./README.md#requestvalidation) for the informed address, the method will return a message of error.

```json
{"error":"request validation not found or expired."}
```

#### /block/

creates a new Block. An user must have an [valid request](./README.md#message-signaturevalidate) upon the POST of the block, otherwise it will not be included

##### Parameters

- ```address```: string. An valid bitcoin wallet address
- ```star```: object. It contains information about a star
- ```star.dec```:string. the declination of the star, according to the [equatorial coordinate system](https://en.wikipedia.org/wiki/Declination)
- ```star.ra```:string. the right ascension of the star, according to the [equatorial coordinate system](https://en.wikipedia.org/wiki/Right_ascension)
- ```star.story```:string. some complementary information about the star, it should not surpass 500 bytes of data.

Example of input below.

```json
{
    "address": "n4CmtZCpseQJGa4Wn3He3tCtAp4S5s76Qg",
    "star": {
                "dec": "40° 57' 20.332",
                "ra": "03h 08m 10.1315s",
                "story": "Algol Star, also known as Beta Persei, means 'demon' in arabic, and is where the original part of RPG Serie Phantasy Star is set."
            }
}
```

##### Result

The request return the block put on the chain. It's similar to the JSON returned by [/block/h](./README.md#blockh), except that **there is no field storyDecode**, since this is a field created only on query returns.

In case there is problem with input, there should distinct errors:

When JSON is not provided at the body of the message.

```json
{"error": "No JSON input."}
```

When some of the parameters described are missing.

```json
{"error": "No {field} key on JSON input."}
```

When some of the parameters described are empty

```json
{"error": "{field} key is empty."}
```

When the object received is not a object or string

```json
{"error": "${field} can not be checked if is empty or not"}
```

When the star story is malformatted:

```json
{"error":"story exceeds maximum length of 500 bytes or isn't ASCII encoded"}
```

When there are other fields than specified in parameters

```json
{"error": "unexpected field ${field[i]} found in request. Block not created"}
```

In the case there is no [valid request](./README.md#message-signaturevalidate) of that address to post on the chain, the user will receive the following message.

```json
{"error":"validation not found or expired."}
```

-----

### Built with

- [bitcoin-message](https://github.com/bitcoinjs/bitcoinjs-message) for checking the signature of messages
- [crypto-js](https://github.com/brix/crypto-js) for generating hash of the blocks
- [LevelDB](https://github.com/google/leveldb) for store and retrieving of blocks
- [hapi](https://github.com/hapijs/hapi) for API endpoints configuration
