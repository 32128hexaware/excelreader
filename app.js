    var express = require('express');
    var app = express();
    
    var bodyParser = require('body-parser');
    var Excel = require('exceljs');

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
    app.use(bodyParser.json());
    
    app.post('/parseExcel', function(req, res) {
    
        console.log(req.body);

        var workbook = new Excel.Workbook();
        workbook.xlsx.readFile('./data/ADM_Outing_30_06_17.xlsx')
            .then(function() {
                console.log('Reading file');
                var worksheet = workbook.getWorksheet('ADM');
                var row = worksheet.getRow(1);
                var headerContent = [{id:1,name:'heading1'}, 
                    {id:2,name:'heading2'}, 
                    {id:3,name:'heading3'},
                    {id:4,name:'heading4'}, 
                    {id:5,name:'heading5'}];
                    
                /*row.eachCell(function(cell, colNumber) {
                    //console.log('Cell ' + colNumber + ' = ' + cell.value);
                    if(cell.value) {
                        //headerContent.push(cell.value);
                        console.log(cell.value);
                    }
                })*/
               
                return res.status(200).send({headers: headerContent});    
               
                
            });
            console.log('Read completed');
            //return res.status(500).send({"Error": "Could not process file"});
    });


    app.listen('3000', function(){
        console.log('running on 3000...');
    });
