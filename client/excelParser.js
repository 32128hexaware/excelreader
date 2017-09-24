angular.module('myParser', [])
  .controller('myParserCntrl', ['$http', function($http, $scope) {
    

    var inst = this;

    

    inst.choosenHeaderIndex = [];
    inst.choosenHeaders = [];
    
    inst.choosenStyle = 'font_look_0';
    inst.currentChoosenStyleIndex = 0;

    inst.freezedStyles = [];
    

    inst.headerAndStyle = [];
   

    inst.listOfFontSizeStyle = ['font_look_0','font_look_1','font_look_2','font_look_3','font_look_4','font_look_5'];

    inst.inputExcelFile = null;

    inst.fileList = [];

    
    inst.reset = function() {
      inst.choosenHeaderIndex = [];
      inst.choosenHeaders = [];
      inst.choosenStyle = 'font_look_0';
      inst.currentChoosenStyleIndex = 0;
      inst.headerAndStyle = [];
      inst.inputExcelFile = null;
      inst.fileList = [];
      inst.freezedStyles = [];
    }

    inst.setExcel = function(fileName) {
      inst.inputExcelFile = fileName;
    }
    
    inst.getExcel = function() {
      return inst.inputExcelFile;
    }

    inst.testOne = function(test) {
      console.log(test);
      $scope.resultval=test;
    }

    inst.parseExcel = function() {
      inst.reset();

      inst.inputExcelFile = inst.uploadForm.excelFileName;
      console.log("File Name is "+ inst.inputExcelFile);

      $http({
        method: 'POST',
        url: "/parseExcel",
        headers: {'Content-Type': 'application/json'},
        data: {file:inst.inputExcelFile}
      }).then(function(res) {
        var headings = res.data.headers;
        inst.fileList = headings;
        
      });
      

    }

    inst.addForEdit = function() {
        angular.forEach(inst.choosenHeaderIndex, function(value, key) {
          var choosenHead = inst.fileList[value];
          inst.choosenHeaders.push(choosenHead);
          //console.log(choosenHead);
          inst.headerAndStyle.push({header:choosenHead, hdstyle:'font_look_0', styleIndex:0});
        });
    }

    inst.increaseFontSize = function() {
        var maxStyles = inst.listOfFontSizeStyle.length;
        var headAndStyle = inst.headerAndStyle[inst.headerAndStyle.length - 1];
        var currentIndex = headAndStyle.styleIndex;
        currentIndex++;
        if(currentIndex < maxStyles) {
            
            headAndStyle.hdstyle = inst.listOfFontSizeStyle[currentIndex];

            headAndStyle.styleIndex = currentIndex;
        }
    }

    inst.decreaseFontSize = function() {
      var headAndStyle = inst.headerAndStyle[inst.headerAndStyle.length - 1];
      var currentIndex = headAndStyle.styleIndex;
      currentIndex--;
      if(currentIndex >= 0) {
          headAndStyle.hdstyle = inst.listOfFontSizeStyle[currentIndex];
          headAndStyle.styleIndex = currentIndex;
      }
    }

    inst.getPreviewData = function() {

      var queryStyles = inst.headerAndStyle;
      //console.log(queryStyles);
      var columnNumbers = [];
      for(var i=0; i < queryStyles.length; i++) {
        columnNumbers.push(queryStyles[i].header.columnNumber);  
      }
      

      $http({
        method: 'POST',
        url: "/getPreviewData",
        headers: {'Content-Type': 'application/json'},
        data: {'columnNumbers' : columnNumbers}
      }).then(function(res) {
        var previewData = res.data.previewData;
        console.log(previewData);
        var queryStyles = inst.headerAndStyle;
        inst.freezedStyles = queryStyles;
        inst.headerAndStyle = [];
        var rec = 0;
        var maxRec = previewData.length;
        var choosenStyles = queryStyles.length;
        for(var i=0; i<maxRec; i += choosenStyles) {
          angular.forEach(queryStyles, function(value, key) {
            
            inst.headerAndStyle.push({header:previewData[rec], hdstyle:value.hdstyle, styleIndex:value.styleIndex});
            rec++;
            
          });
          inst.headerAndStyle.push({header: {
              id : 0, 
              name : '----------------------------', 
              columnNumber : 0
            },
            hdstyle:'font_look_0', 
            styleIndex:0,
            lineBreaker:true});
        }
        
      });
    }
    

    inst.prepareResultDoc = function() {
      
            var queryStyles = inst.freezedStyles;
            console.log(queryStyles);
            var columnNumbers = [];
            for(var i=0; i < queryStyles.length; i++) {
              columnNumbers.push(queryStyles[i].header.columnNumber);  
            }
            
      
            $http({
              method: 'POST',
              url: "/downloadFile",
              headers: {'Content-Type': 'application/json'},
              data: {'columnNumbers' : columnNumbers, docStyle : inst.freezedStyles}
            }).then(function(res) {
              
                console.log("Proceess completed")
              
            });
          }


  }]);
