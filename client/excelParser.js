angular.module('myParser', [])
  .controller('myParserCntrl', ['$http', function($http, $scope) {
    

    var inst = this;

    inst.choosenHeaderIndex = [];
    inst.choosenHeaders = [];
    
    inst.choosenStyle = 'font_look_0';
    inst.currentChoosenStyleIndex = 0;


    inst.headerAndStyle = [];


    inst.listOfFontSizeStyle = ['font_look_0','font_look_1','font_look_2'];

    inst.inputExcelFile = null;

    inst.fileList = [];

    
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
        angular.forEach(headings, function(value, key) {
          console.log(key + ': ' + value);

        });
      });
      

    }

    inst.addForEdit = function() {
        angular.forEach(inst.choosenHeaderIndex, function(value, key) {
          var choosenHead = inst.fileList[value];
          inst.choosenHeaders.push(choosenHead);
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

    
  }]);
