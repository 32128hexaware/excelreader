var barcode = require('barcode');
var path = require('path');

var code39 = barcode('code39', {
    data: "it works",
    width: 400,
    height: 100,
});

var outfile = path.join('K:/', 'imgs', 'mycode.png')
code39.saveImage(outfile, function (err) {
    if (err) throw err;
 
    console.log('File has been written!');
});