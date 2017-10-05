var officegen = require('officegen');
var docx = officegen ( 'docx' );
var fs = require('fs');
var async = require('async');
var path = require('path');

var data = [
    {
        type: "text",
        val: "Fonts face and size.",
        lopt: { align: 'centre' },
        opt: { color:'#003399', font_face: 'Times New Roman', font_size: 42 }
	},
	{
        type: "image",
        path: path.join('/niraineer', 'imgs', 'mycode.png')
    }
];

exports.prepareDoc = function(content, resultPath) {

	docx.createByJson(content);
	
	var out = fs.createWriteStream ( resultPath );
	
	out.on ( 'error', function ( err ) {
		console.log ( err );
	});
	
	async.parallel ([
		function ( done ) {
			out.on ( 'close', function () {
				console.log ( 'Finish to create a DOCX file.' );
				done ( null );
			});
			docx.generate ( out );
		}
	
	], function ( err ) {
		if ( err ) {
			console.log ( 'error: ' + err );
		} // Endif.
	});

}

//this.prepareDoc(data, '/niraineer/result.docx');
