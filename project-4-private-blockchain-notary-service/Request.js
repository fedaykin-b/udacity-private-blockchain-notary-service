/**
 * Class representing a Request Validation
 */

const TIME_REQUEST_WINDOW_TIME = 5 * 60 * 1000 // milliseconds
class Request {

  /**
   *
   * @param {JSON} address
   */
  constructor(address) {
    this.address = address;
    this.requestTimeStamp = new Date().getTime().toString().slice(0, -3);
    this.message = this.writeMessage()
  }

  writeMessage() {
    return `${this.address}:${this.requestTimeStamp}:starRegistry`
  }

  countTimeWindow() {
    let timeElapse = (new Date().getTime().toString().slice(0, -3)) - this.requestTimeStamp;
    this.validationWindow = (TIME_REQUEST_WINDOW_TIME / 1000) - timeElapse
    return this
  }

  prepareSelfDestruction(mempool) {
    setTimeout(() => {
      mempool[this.address] = null
    }, TIME_REQUEST_WINDOW_TIME);
    return this
  }
}

module.exports.Request = Request