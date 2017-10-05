var barcode = require('barcode');
var path = require('path');


exports.generateBarcode = function(content) {
    console.log("Writing content");
    var code39 = barcode('code39', {
        data: content,
        width: 400,
        height: 100,
    });
    
    var outfile = path.join('/niraineer', 'imgs', content)
    code39.saveImage(outfile, function (err) {
        if (err) throw err;
     
        console.log('File has been written!');
    });
}

