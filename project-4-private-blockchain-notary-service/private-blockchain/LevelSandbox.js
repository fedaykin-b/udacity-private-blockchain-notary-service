/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';
/**
 * Class that wraps LevelDB operations
 */
class LevelSandbox {
  /**
   * creates a LevelSandbox object
   */
  constructor() {
    this.db = level(chainDB);
  }

  /**
   * Get data from levelDB with key
   * @param {number} key
   * @return {Promise<string|null|Error>} - A Promise that resolves with either the corresponding value or undefined if not found, or rejects with Error.
   */
  getLevelDBData(key) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.get(key, function(err, value) {
        if (err) {
          if (err.type == 'NotFoundError') {
            resolve(null);
          } else {
            console.log('Block ' + key + ' get failed', err);
            reject(err);
          }
        }
        resolve(value);
      });
    });
  }

  /**
   *
   * @param {string} value
   * @param {string} field
   * @return {Promise<Array<string>|null|Error>}
   */
  getLevelDBDataByProperty(value, field) {
    let self = this;
    let block = [];
    let nestedField = []
    if (/\./.test(field)) {
      nestedField = field.split('.')
      field = nestedField.pop()
    }
    return new Promise(function (resolve, reject) {
      self.db.createReadStream()
        .on('data', function (data) {
          let obj = JSON.parse(data.value)
          //necessary to carry on the searching value inside nested objects
          nestedField.forEach((innerField) => {obj = obj[innerField]})
          if (obj[field] === value) {
            block.push(data.value);
          }
        })
        .on('error', function (err) {
          reject(err)
        })
        .on('close', function () {
          resolve(block);
        });
    });
  }

  //
  /**
   * Add data to levelDB with key and value
   * @param {number} key
   * @param {*} value
   * @return {Promise<string|Error>} - A Promise that add the (key, value) on db and resolves with value, or rejects with Error.
   */
  addLevelDBData(key, value) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.db.put(key, value, function(err) {
        if (err) {
          reject(err);
        }
        resolve(value);
      });
    });
  }

  /**
   * Method that return the height
   * @return {Promise<number|Error>} - A Promise that counts the number of elements in the db and resolves with the value, or rejects with Error.
   */
  getBlocksCount() {
    let self = this;
    return new Promise(function(resolve, reject) {
      let count = 0;
      self.db.createReadStream()
          .on('data', function(data) {
            count++;
          })
          .on('error', function(err) {
            reject(err);
          })
          .on('close', function() {
            resolve(count);
          });
    });
  }
}

module.exports.LevelSandbox = LevelSandbox;
