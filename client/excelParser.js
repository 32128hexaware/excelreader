angular.module('myParser', [])
  .controller('myParserCntrl', function($scope) {
    var inst = this;
    
    inst.inputExcelFileName = null;

    inst.fileList = ['tsetomg', 'how'];

    
    inst.setExcel = function(fileName) {
      inst.inputExcelFileName = fileName;
    }
    
    inst.getExcel = function() {
      return inst.inputExcelFileName;
    }

    inst.testOne = function(test) {
      console.log(test);
      $scope.resultval=test;
    }

    inst.parseExcel = function() {
      inst.fileList.push(inst.inputExcelFileName);
      inst.inputExcelFileName = '';
    }
    
  });
