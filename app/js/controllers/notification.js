'use strict';

playlistMakerApp.controller('NotificationController', function($scope) {
  $scope.progressBar = 0;
  $scope.moneyToPay = 0;
  var totalMoney = 200;
  $scope.progressBarMessage = totalMoney + ' still needed for this project';


  $scope.checkPendingMoney = function(newVal) {
    $scope.progressBar = (newVal*100/totalMoney);
    $scope.progressBarMessage = totalMoney-newVal + ' still needed for this project';
  }

  $scope.dummyFunction = function() {
    alert('A dummy function');
  }

})
