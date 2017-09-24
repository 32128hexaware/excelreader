    var express = require('express');
    var app = express();
    
    var bodyParser = require('body-parser');
    var Excel = require('exceljs');
    var multer = require('multer');
    var fs =require('fs');
    var trim = require('trim');

    const localfolder = './src/log';
    const logFile= 'result.log';


    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    /** Serving from the same express Server
    No cors required */
    app.use(express.static('./client'));
    app.use(express.static('./data'));
    app.use(bodyParser.json());




    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './data/');
        },
        filename: function (req, file, cb) {
           filenamepasiing = "./data/"+file.originalname
            fileName=file.originalname;
              var datetimestamp = Date.now();
            cb(null, file.originalname);
        }
    });
 
    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');
    
    app.post('/parseExcel', function(req, res) {
    

        upload(req,res,function(err){
            if(err){
                console.log("Error occured");
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            console.log(req.body);
        });

        console.log("Request is "+JSON.stringify(req.body));

        var workbook = new Excel.Workbook();
        workbook.xlsx.readFile('./data/ADM_Outing_30_06_17.xlsx')
            .then(function() {


                console.log('Reading file');
                var worksheet = workbook.getWorksheet('ADM');
                var row = worksheet.getRow(1);
                var headerContent = [];
                var headerId = 1;
                row.eachCell(function(cell, colNumber) {
                    //console.log('Cell ' + colNumber + ' = ' + cell.value);
                    var colData = cell.value;
                    var headData = '';

                    if(colData) {
                        //headerContent.push(cell.value);
                        if(colData.richText) {
                            
                            var colMessage = colData.richText;
                            var colMessageLen = colMessage.length;
                            for(var i=0; i<colMessageLen; i++) {
                                headData += trim(colMessage[i].text);
                            }
                            
                        } else {
                            headData = cell.value;
                        }
                        
                        if(headData) {
                            headerContent.push({id:headerId,name:headData});
                            headerId++;
                        }
                        
                    }
                });

                return res.status(200).send({headers: headerContent});    
            });
    });


    app.listen('3000', function(){
        console.log('running on 3000...');
    });
