// Require file system access
fs = require('fs');

// Read file buffer 
imgReadBuffer = fs.readFileSync("../good ideias don't require force decoded.jpg");


// Encode image buffer to hex
imgHexEncode = new Buffer(imgReadBuffer).toString('hex');

// Output encoded data to console
console.log(imgHexEncode);

// Decode hex
var imgHexDecode = new Buffer(imgHexEncode, 'hex');

// Save decoded file file system 
fs.writeFileSync('decodedHexImage.jpg', imgHexDecode);
