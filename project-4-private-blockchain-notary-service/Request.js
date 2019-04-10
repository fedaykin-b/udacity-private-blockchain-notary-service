/**
 * Class representing a Request Validation
 */
class RequestValidation {

  /**
   * 
   * @param {JSON} address 
   */
  constructor(request) {
    this.address = request.address;
    this.requestTimeStamp = new Date().getTime().toString().slice(0, -3);
    this.message = this.writeMessage()
    this.validationWindow = this.countTimeWindow()
  }

  writeMessage() {
    return 'Not implemented.'
  }

  countTimeWindow() {
    return 'Not implemented.'
  }
}

module.exports.RequestValidation = RequestValidation