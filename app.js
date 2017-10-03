    var express = require('express');
    var app = express();
    
    var bodyParser = require('body-parser');
    var Excel = require('exceljs');
    var multer = require('multer');
    var fs =require('fs');
    var trim = require('trim');

    var docWriter = require('./server/docWriter');

    const localfolder = './src/log';
    const logFile= 'result.log';

    var uploadedFileName=null;


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
            uploadedFileName = "./data/"+file.originalname
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
            var workbook = new Excel.Workbook();
            workbook.xlsx.readFile(uploadedFileName)
                .then(function() {
    
    
                    console.log('Reading file');
                    var worksheet = workbook.getWorksheet(1);
                    var row = worksheet.getRow(1);
                    var headerContent = [];
                    var headerId = 0;
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
                                headerContent.push({id:headerId,name:headData,columnNumber:colNumber});
                                headerId++;
                            }
                            
                        }
                    });
    
                    return res.status(200).send({headers: headerContent});    
                });
        });

    });

    app.post('/getPreviewData', function(req, res) {
        console.log("Get Request is "+JSON.stringify(req.body));

        var workbook = new Excel.Workbook();
        var asciIndex = 64;
        var previewContent = [];

        workbook.xlsx.readFile(uploadedFileName)
            .then(function() {


                console.log('Reading file');
                var worksheet = workbook.getWorksheet('ADM');
                
                var choosenColumnNumbers = req.body.columnNumbers;
                var totalRows = worksheet.rowCount;

                console.log(totalRows)

                for(var rowNum = 2; rowNum <= 4; rowNum++) {
                    for(var i=0; i<choosenColumnNumbers.length; i++) {
                        
                        var coloumnName = String.fromCharCode(asciIndex+choosenColumnNumbers[i]) + rowNum;
                        var columnValue = worksheet.getCell(coloumnName).value;
                        previewContent.push({id : rowNum, 
                            name : columnValue, 
                            columnNumber : choosenColumnNumbers[i]});
                        
                    }
                }
                

                return res.status(200).send({previewData: previewContent});    
            });


    });


    app.post('/downloadFile', function(req, res) {
        
        var documentStyle = req.body.docStyle;
        var docColumNumber = req.body.columnNumbers;

        var workbook = new Excel.Workbook();
        var asciIndex = 64;
        var previewContent = [];

        workbook.xlsx.readFile(uploadedFileName)
            .then(function() {

                var documentContent = [];
                console.log('Reading file');
                
                var worksheet = workbook.getWorksheet('ADM');
                
                
                var totalRows = worksheet.rowCount;

                console.log(totalRows)

                for(var rowNum = 2; rowNum <= 4; rowNum++) {
                    for(var i=0; i<docColumNumber.length; i++) {
                        
                        var coloumnName = String.fromCharCode(asciIndex+docColumNumber[i]) + rowNum;
                        var columnValue = worksheet.getCell(coloumnName).value;
                        var fontSize = (documentStyle.styleIndex * 4) + 24;
                        documentContent.push(
                            {
                                type: "text",
                                val: columnValue,
                                lopt: { align: 'centre' },
                                opt: { color:'#003399', font_face: 'Times New Roman', font_size: fontSize }
                            }
                        );
                        
                    }
                }
                
                docWriter.prepareDoc(documentContent, './data/result.docx')

                return res.status(200).send({previewData: documentContent});    
            });
        


    });

    app.listen('3000', function(){
        console.log('running on 3000...');
    });
