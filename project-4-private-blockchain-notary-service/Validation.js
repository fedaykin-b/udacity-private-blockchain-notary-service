const bitcoinMessage = require('bitcoinjs-message')

const TIME_REQUEST_WINDOW_TIME = 5 * 60 * 1000 // milliseconds

/**
 * Class representing a Validation of a request to publish on StarRegistry
 */
class Validation {

  /**
   *
   * @param {Request.Request} address
   * @param {string} signature
   */
  constructor(request, signature) {
    this.registerStar = true
    this.status = {
      address: request.address,
      requestTimeStamp: request.requestTimeStamp,
      message: request.message,
      validationWindow: request.validationWindow,
      messageSignature: ''
    }
    this.verifySignature(signature)
  }

  /**
   *
   * @param {string} signature
   */
  verifySignature(signature) {
    let is_valid = bitcoinMessage.verify(this.status.message, this.status.address, signature)
    this.status.messageSignature = is_valid
  }

  countTimeWindow() {
    let timeElapse = (new Date().getTime().toString().slice(0, -3)) - this.status.requestTimeStamp;
    this.status.validationWindow = (TIME_REQUEST_WINDOW_TIME / 1000) - timeElapse
    return this
  }

  prepareSelfDestruction(mempool) {
    setTimeout(() => {
      mempool[this.address] = null
    }, TIME_REQUEST_WINDOW_TIME);
    return this
  }
}

module.exports.Validation = Validation